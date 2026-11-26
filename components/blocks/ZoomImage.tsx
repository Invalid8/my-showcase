"use client";

import Image, { type ImageProps } from "next/image";
import { useRef } from "react";

type ZoomImageProps = ImageProps & { alt: string };

export function ZoomImage({ alt, className, ...image }: ZoomImageProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        className="zoom-trigger"
        onClick={() => dialog.current?.showModal()}
        aria-label={`View larger: ${alt}`}
      >
        <Image {...image} alt={alt} className={className} />
      </button>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={alt}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") dialog.current?.close();
        }}
      >
        <Image
          src={image.src}
          width={image.width}
          height={image.height}
          alt={alt}
          sizes="100vw"
          quality={90}
        />
        <button
          type="button"
          className="lightbox-close"
          onClick={() => dialog.current?.close()}
          aria-label="Close"
        >
          esc ✕
        </button>
      </dialog>
    </>
  );
}
