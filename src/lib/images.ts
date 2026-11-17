import manifest from "@/generated/images.json";

export type Img = {
  width: number;
  height: number;
  color: string;
  blur: string;
  avif: [string, number][];
  webp: [string, number][];
};

const images = manifest as unknown as Record<string, Img>;

/** Resolve a content/photos key (e.g. "2023/guzheng") to its generated responsive variants. */
export function getImage(key: string): Img {
  const img = images[key];
  if (!img) throw new Error(`Unknown image "${key}". Add content/photos/${key}.jpg and run \`npm run images\`.`);
  return img;
}
