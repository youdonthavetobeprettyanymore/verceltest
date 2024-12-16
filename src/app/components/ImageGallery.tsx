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

interface ImageData {
  _key: string;
  asset: any;
  hotspot?: any;
  crop?: any;
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

  // Memoize the images to prevent unnecessary re-computation
  const memoizedImages = useMemo(() => images, [images]);

  // Precompute image URLs with appropriate quality and format
  const getImageUrl = useCallback((image: any, width?: number) => {
    const viewportWidth =
      width || (typeof window !== "undefined" ? window.innerWidth : 1200);
    return urlFor(image)
      .width(viewportWidth)
      .quality(60) // Helps with speed
      .auto("format") // Converts images to webp for faster loading
      .url();
  }, []);

  const imageUrls = useMemo(() => {
    return memoizedImages.map((image) => ({
      small: getImageUrl(image, 600), // For speed
      large: getImageUrl(image, 1200), // For speed
    }));
  }, [memoizedImages, getImageUrl]);

  const openModal = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // Previous Image. Accessibility stuff.
  const showPrevImage = useCallback(
    (e?: React.MouseEvent | KeyboardEvent) => {
      if (e) e.stopPropagation();
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? memoizedImages.length - 1 : prevIndex - 1
      );
    },
    [memoizedImages.length]
  );

  // Next Image. Accessibility stuff.
  const showNextImage = useCallback(
    (e?: React.MouseEvent | KeyboardEvent) => {
      if (e) e.stopPropagation();
      setCurrentIndex((prevIndex) =>
        prevIndex === memoizedImages.length - 1 ? 0 : prevIndex + 1
      );
    },
    [memoizedImages.length]
  );

  // Handle keyboard navigation
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
      // Stop background from scrolling when the modal is open
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

  // Preload next and previous images
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
                  priority={index < 3} // Preload first few images
                />
              </div>
            </div>
          );
        })}
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div
          ref={modalRef}
          tabIndex={-1}
          className="fixed inset-0 bg-hot-pink bg-opacity-90 z-50 overflow-y-auto"
          onClick={closeModal}
          role="dialog"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-5">
            {/* Close button */}
            <button
              className="text-white text-4xl sm:text-5xl font-bold outline-none"
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
            >
              Close
            </button>

            {/* Download button */}
            <a
              href={memoizedImages[currentIndex].asset.url}
              download
              className="text-white text-4xl sm:text-5xl underline"
            >
              Download
            </a>
          </div>

          {/* Content */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            {/* Left arrow button */}
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

            {/* Right arrow button */}
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

            {/* Modal Image */}
            <div className="flex items-center justify-center w-full overflow-hidden px-4 pb-10 md:pb-5">
              <div className="relative w-full max-w-4xl">
                {(() => {
                  const currentImage = memoizedImages[currentIndex];
                  const imageUrl = imageUrls[currentIndex].large;
                  const { width, height } =
                    currentImage.asset.metadata.dimensions;

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
