"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Icon,
  SmartImage,
} from "@/components/ui";

import type {
  MediaRef,
} from "@/lib/types";

type ProductGalleryProps = {
  name: string;

  image?: string;

  gallery?: string[];

  video?: MediaRef;
};

export default function ProductGallery({
  name,
  image,
  gallery = [],
  video,
}: ProductGalleryProps) {
  const images =
    useMemo(
      () =>
        Array.from(
          new Set(
            [
              image,
              ...gallery,
            ].filter(
              (
                value,
              ): value is string =>
                Boolean(
                  value?.trim(),
                ),
            ),
          ),
        ),
      [
        image,
        gallery,
      ],
    );

  const [
    selectedImage,
    setSelectedImage,
  ] =
    useState(
      images[0] ??
        "",
    );

  useEffect(
    () => {
      if (
        !images.length
      ) {
        setSelectedImage(
          "",
        );

        return;
      }

      if (
        !selectedImage ||
        !images.includes(
          selectedImage,
        )
      ) {
        setSelectedImage(
          images[0],
        );
      }
    },
    [
      images,
      selectedImage,
    ],
  );

  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-[76px_minmax(0,1fr)]">
      {/* THUMBNAILS */}

      {(images.length >
        1 ||
        video?.src) && (
        <div className="order-2 flex gap-2 overflow-x-auto pb-1 sm:order-1 sm:flex-col sm:overflow-visible">
          {images.map(
            (
              item,
              index,
            ) => {
              const active =
                selectedImage ===
                item;

              return (
                <button
                  key={
                    item
                  }
                  type="button"
                  onClick={() =>
                    setSelectedImage(
                      item,
                    )
                  }
                  aria-label={`View ${name} image ${
                    index +
                    1
                  }`}
                  aria-pressed={
                    active
                  }
                  className={`
                    flex
                    h-[72px]
                    w-[72px]
                    shrink-0
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-xl
                    bg-white
                    p-2
                    transition
                    ${
                      active
                        ? "border-2 border-brand-600 shadow-sm"
                        : "border border-line hover:border-brand-300"
                    }
                  `}
                >
                  <SmartImage
                    src={
                      item
                    }
                    alt={`${name} thumbnail ${
                      index +
                      1
                    }`}
                    className="h-full w-full object-contain"
                  />
                </button>
              );
            },
          )}

          {video?.src && (
            <a
              href={
                video.src
              }
              target="_blank"
              rel="noreferrer"
              className="
                flex
                h-[72px]
                w-[72px]
                shrink-0
                flex-col
                items-center
                justify-center
                gap-1
                rounded-xl
                border
                border-line
                bg-white
                text-[10px]
                font-bold
                text-ink-muted
                transition
                hover:border-brand-300
                hover:text-brand-700
              "
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                <Icon
                  name="play"
                  className="h-3.5 w-3.5"
                />
              </span>

              Video
            </a>
          )}
        </div>
      )}

      {/* MAIN IMAGE */}

      <div
        className="
          order-1
          relative
          flex
          min-h-[360px]
          items-center
          justify-center
          overflow-hidden
          rounded-2xl
          border
          border-line
          bg-[#f4f6f8]
          p-7
          shadow-sm
          sm:order-2
          md:min-h-[430px]
          xl:min-h-[470px]
        "
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(0,129,245,.09),transparent_48%)]" />

        {selectedImage ? (
          <SmartImage
            src={
              selectedImage
            }
            alt={
              name
            }
            eager
            className="
              relative
              z-[1]
              h-full
              w-full
              object-contain
              transition-transform
              duration-300
              hover:scale-[1.025]
            "
          />
        ) : (
          <div className="relative z-[1] text-center text-ink-faint">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
              <Icon
                name="box"
                className="h-7 w-7"
              />
            </span>

            <p className="mt-3 text-xs font-semibold">
              Product image not
              available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}