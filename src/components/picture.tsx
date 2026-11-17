// Images are pre-built by scripts/build-images.mjs (AVIF + WebP, content-hashed), so a plain <picture> is used instead of next/image.
import type { Img } from "@/lib/images";

type Props = {
  img: Img;
  alt: string;
  /** The `sizes` attribute — describe how wide the image renders so the browser picks the right file. */
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  placeholder?: boolean;
  objectPosition?: string;
};

const srcset = (list: [string, number][]) => list.map(([u, w]) => `${u} ${w}w`).join(", ");

export function Picture({ img, alt, sizes, className, imgClassName, priority, placeholder = true, objectPosition }: Props) {
  const fallback = (img.webp.find(([, w]) => w >= 1280) ?? img.webp[img.webp.length - 1])?.[0];
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcset(img.avif)} sizes={sizes} />
      <img
        src={fallback}
        srcSet={srcset(img.webp)}
        sizes={sizes}
        width={img.width}
        height={img.height}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={imgClassName}
        style={{
          objectPosition,
          ...(placeholder && {
            backgroundColor: img.color,
            backgroundImage: `url(${img.blur})`,
            backgroundSize: "cover",
            backgroundPosition: objectPosition ?? "center",
          }),
        }}
      />
    </picture>
  );
}
