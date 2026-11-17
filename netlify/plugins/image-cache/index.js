// Persist generated responsive images between Netlify builds so only new/changed photos
// are re-encoded (a cold build of every photo takes a few minutes; a warm one is ~1s).
// Uses Netlify's built-in build cache API — no third-party plugin required.
const DIRS = [".cache", "public/img", "public/og", "src/generated"];

export const onPreBuild = async ({ utils }) => {
  for (const d of DIRS) await utils.cache.restore(d);
};

export const onPostBuild = async ({ utils }) => {
  for (const d of DIRS) await utils.cache.save(d);
};
