# P2S1 participant API

A tiny, read-only HTTP API that powers “Find a participant” and “Champions” on https://p2s1.stanleyowen.com (and https://p2s1.netlify.app).
It exists so the participant list never has to live in the public repo or the site's JavaScript.

- **Zero dependencies** — just Node's `http` module. Nothing to `npm install`, nothing to patch.
- **Minimal data** — `{ name, class, competition, result }` only. Student ID numbers are dropped before the data reaches the server.
- **Hard to scrape** — ≥3-character queries, max 10 results per call (all of one student's entries when every match is the same name), per-IP token bucket (60/min, burst 20).
- **Locked down** — GET/HEAD/OPTIONS only, CORS allow-list, strict response headers, 5-second timeouts, queries never logged.
- **Container hardening** — non-root, read-only filesystem, all capabilities dropped, `no-new-privileges`, memory/PID/CPU limits,
  data mounted read-only, port bound to `127.0.0.1` only.

## Endpoints

| Method | Path | Returns |
| --- | --- | --- |
| GET | `/healthz` | `ok` |
| GET | `/v1/editions` | `[2023, 2024]` |
| GET | `/v1/editions/:year/search?q=…` | `{ query, total, truncated, results: [{ name, class, competition, result }] }` |
| GET | `/v1/editions/:year/champions` | `[{ competition, podium: [{ place, entries: [{ name, class }] }] }]` |

## Deploy on the Ubuntu server (Docker + Cloudflare Tunnel)

The public hostname is `p2s1-cdn.stanleyowen.com`. No router ports are opened: `cloudflared` makes an outbound connection to Cloudflare.

**1. Create a dedicated tunnel** (on the server, which is logged in to Cloudflare via `~/.cloudflared/cert.pem`):

```bash
cloudflared tunnel create p2s1-api
cloudflared tunnel route dns p2s1-api p2s1-cdn.stanleyowen.com
```

The `cloudflared` container runs this tunnel with `--url http://api:8080`, so it can only ever reach the API. It is
separate from the host's existing `ssh` tunnel. Current deployment: tunnel `p2s1-api`, code in `~/server/p2s1-api` on stanley-desktop.
Keep the folder named `p2s1-api`: Compose derives the project name (and so the container names) from it.

**2. Copy code and data to the server** (data goes over SSH, never through git):

```bash
# on your laptop, from the repo root
cd server && npm run normalize            # data/raw/*.json → data/2023.json, data/2024.json (IDs removed)
rsync -a --exclude data/raw/ --exclude .env --exclude test/ ./ stanley@192.168.1.100:~/server/p2s1-api/
```

**3. Start it:**

```bash
# on the server
cd ~/server/p2s1-api
umask 077; printf "CLOUDFLARE_TUNNEL_TOKEN=%s\n" "$(cloudflared tunnel token p2s1-api)" > .env
chmod 644 data/*.json
docker compose --profile tunnel up -d --build
curl -s localhost:8787/healthz            # → ok
curl -s https://p2s1-cdn.stanleyowen.com/v1/editions
```

**4. Recommended Cloudflare settings** for the hostname: *Security → WAF → Rate limiting rule* (e.g. 100 requests/min per IP on
`/v1/`) as a second layer, and *SSL/TLS → Edge Certificates → Always Use HTTPS*.

### Updating

```bash
docker compose --profile tunnel pull && docker compose --profile tunnel up -d --build   # code / base image
docker compose restart api                                                               # after changing data/*.json
```

### Local development

```bash
npm run dev     # http://localhost:8787, allows http://localhost:3000
npm test        # uses synthetic fixtures only
```

## Data files

`data/` is gitignored. Keep the raw spreadsheets (`data/raw/`) on your laptop or another private location; only the normalized
`data/<year>.json` files need to be on the server. To add a year, put `<year>-rekap.json` in `data/raw/`, extend
`scripts/normalize.mjs` if the columns differ, run `npm run normalize`, copy the new file over and restart.
