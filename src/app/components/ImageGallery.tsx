"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import Image from "next/image";
import { urlFor } from "../sanity/sanity";

interface SanityImageDimensions {
  width: number;
  height: number;
}

interface SanityImageMetadata {
  dimensions: SanityImageDimensions;
}

interface SanityImageAsset {
  _id: string;
  url: string;
  metadata?: SanityImageMetadata;
}

interface SanityHotspot {
  x?: number;
  y?: number;
  height?: number;
  width?: number;
}

interface SanityCrop {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

interface ImageData {
  _key: string;
  asset: SanityImageAsset;
  hotspot?: SanityHotspot;
  crop?: SanityCrop;
}

interface ImageGalleryProps {
  images: ImageData[];
  eventTitle: string;
}

export default function ImageGallery({
  images,
  eventTitle,
}: ImageGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const modalRef = useRef<HTMLDivElement>(null);

  const memoizedImages = useMemo(() => images, [images]);

  const getImageUrl = useCallback((image: ImageData, width?: number) => {
    const viewportWidth =
      width || (typeof window !== "undefined" ? window.innerWidth : 1200);
    return urlFor(image).width(viewportWidth).quality(60).auto("format").url();
  }, []);

  const imageUrls = useMemo(() => {
    return memoizedImages.map((image) => ({
      small: getImageUrl(image, 600),
      large: getImageUrl(image, 1200),
    }));
  }, [memoizedImages, getImageUrl]);

  const openModal = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const showPrevImage = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? memoizedImages.length - 1 : prevIndex - 1
    );
  }, [memoizedImages.length]);

  const showNextImage = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === memoizedImages.length - 1 ? 0 : prevIndex + 1
    );
  }, [memoizedImages.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowLeft") {
        showPrevImage();
      } else if (e.key === "ArrowRight") {
        showNextImage();
      }
    },
    [closeModal, showPrevImage, showNextImage]
  );

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
      if (modalRef.current) {
        modalRef.current.focus();
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen, handleKeyDown]);

  useEffect(() => {
    if (isModalOpen) {
      const preloadImage = (url: string) => {
        const img = new window.Image();
        img.src = url;
      };

      const nextIndex = (currentIndex + 1) % memoizedImages.length;
      const prevIndex =
        (currentIndex - 1 + memoizedImages.length) % memoizedImages.length;

      preloadImage(imageUrls[nextIndex].large);
      preloadImage(imageUrls[prevIndex].large);
    }
  }, [currentIndex, isModalOpen, memoizedImages.length, imageUrls]);

  const handleImageClick = useCallback(
    (index: number) => {
      openModal(index);
    },
    [openModal]
  );

  return (
    <div className="relative">
      <div
        className={`grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${
          isModalOpen ? "opacity-20" : ""
        }`}
      >
        {memoizedImages.map((image, index) => {
          const imageUrl = imageUrls[index].small;

          return (
            <div
              key={image._key}
              className="relative mb-2 cursor-pointer"
              onClick={() => handleImageClick(index)}
            >
              <div className="w-full h-0 pb-[100%] relative">
                <Image
                  src={imageUrl}
                  alt={eventTitle || "Event Image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 200px"
                  priority={index < 3}
                />
              </div>
            </div>
          );
        })}
      </div>
      {isModalOpen && (
        <div
          ref={modalRef}
          tabIndex={-1}
          className="fixed inset-0 bg-hot-pink bg-opacity-90 z-50 overflow-y-auto"
          onClick={closeModal}
          role="dialog"
        >
          <div className="flex justify-between items-center p-5">
            <button
              className="text-white text-4xl sm:text-5xl font-bold outline-none"
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
            >
              Close
            </button>
            <a
              href={memoizedImages[currentIndex].asset.url}
              download
              className="text-white text-4xl sm:text-5xl underline"
            >
              Download
            </a>
          </div>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <div
              className="absolute inset-y-0 left-0 w-[30%] cursor-pointer hover:from-hot-pink hover:to-transparent transition-all duration-300 z-10 flex items-center"
              onClick={showPrevImage}
            >
              <button
                className="ml-5 text-white text-4xl font-bold"
                onClick={showPrevImage}
              >
                &larr;
              </button>
            </div>

            <div
              className="absolute inset-y-0 right-0 w-[30%] cursor-pointer hover:from-hot-pink hover:to-transparent transition-all duration-300 z-10 flex items-center justify-end"
              onClick={showNextImage}
            >
              <button
                className="mr-5 text-white text-4xl font-bold"
                onClick={showNextImage}
              >
                &rarr;
              </button>
            </div>

            <div className="flex items-center justify-center w-full overflow-hidden px-4 pb-10 md:pb-5">
              <div className="relative w-full max-w-4xl">
                {(() => {
                  const currentImage = memoizedImages[currentIndex];
                  const imageUrl = imageUrls[currentIndex].large;
                  const { width = 1200, height = 800 } =
                    currentImage.asset.metadata?.dimensions || {};

                  return (
                    <Image
                      src={imageUrl}
                      alt={eventTitle || "Event Image"}
                      width={width}
                      height={height}
                      style={{
                        objectFit: "contain",
                        maxWidth: "100%",
                        maxHeight: "85vh",
                      }}
                      sizes="(max-width: 768px) 90vw, (max-width: 1200px) 80vw, 1200px"
                      priority
                    />
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
