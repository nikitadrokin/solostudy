import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Image object used in the Lightbox component
 */
export interface LightboxImage {
  src: string;
  alt?: string;
  caption?: string;
}

/**
 * Lightbox component props
 */
export interface LightboxProps extends React.HTMLAttributes<HTMLDivElement> {
  images: LightboxImage[];
  loop?: boolean;
  /** Render only one thumbnail for the given image index */
  thumbnailIndex?: number;
  /** Class for each thumbnail wrapper (default: cursor-pointer overflow-hidden rounded-lg) */
  thumbnailClassName?: string;
  /** Class for each thumbnail img (default: h-48 w-full object-cover …) */
  thumbnailImgClassName?: string;
}

/**
 * A Lightbox component that displays images in a modal with navigation controls
 */
export function Lightbox({
  images,
  loop = false,
  thumbnailIndex,
  className,
  thumbnailClassName,
  thumbnailImgClassName,
  ...props
}: LightboxProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [preloadedIndexes, setPreloadedIndexes] = React.useState<Set<number>>(
    new Set()
  );

  const lightboxRef = React.useRef<HTMLDivElement>(null);
  const thumbnailRefs = React.useRef<(HTMLImageElement | null)[]>([]);
  const thumbnailImages = React.useMemo(() => {
    if (thumbnailIndex === undefined) {
      return images.map((image, index) => ({ image, index }));
    }
    const selectedImage = images[thumbnailIndex];
    if (!selectedImage) {
      return [];
    }
    return [{ image: selectedImage, index: thumbnailIndex }];
  }, [images, thumbnailIndex]);

  const getPreloadIndexes = React.useCallback(
    (index: number): number[] => {
      const previousIndex =
        index > 0 ? index - 1 : loop ? images.length - 1 : null;
      const nextIndex =
        index < images.length - 1 ? index + 1 : loop ? 0 : null;
      return [index, previousIndex, nextIndex].filter(
        (value): value is number => value !== null
      );
    },
    [images.length, loop]
  );

  // Preload current image and adjacent images
  const preloadImages = React.useCallback(
    (index: number) => {
      if (preloadedIndexes.has(index)) return;

      for (const idx of getPreloadIndexes(index)) {
        if (!preloadedIndexes.has(idx)) {
          const img = new Image();
          img.src = images[idx].src;
          img.onload = () => {
            setPreloadedIndexes((prev) => new Set([...prev, idx]));
          };
        }
      }
    },
    [getPreloadIndexes, images, preloadedIndexes]
  );

  // Open lightbox
  const openLightbox = React.useCallback(
    (index: number) => {
      setCurrentIndex(index);
      setIsOpen(true);
      setIsLoading(true);
      document.body.style.overflow = 'hidden';
      preloadImages(index);
    },
    [preloadImages]
  );

  // Close lightbox
  const closeLightbox = React.useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  }, []);

  // Navigate to previous image
  const prevImage = React.useCallback(() => {
    setIsLoading(true);
    if (currentIndex === 0 && !loop) {
      setIsLoading(false);
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      preloadImages(currentIndex - 1);
    } else if (loop) {
      setCurrentIndex(images.length - 1);
      preloadImages(images.length - 1);
    }
  }, [currentIndex, images.length, loop, preloadImages]);

  // Navigate to next image
  const nextImage = React.useCallback(() => {
    setIsLoading(true);
    if (currentIndex === images.length - 1 && !loop) {
      setIsLoading(false);
    } else if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      preloadImages(currentIndex + 1);
    } else if (loop) {
      setCurrentIndex(0);
      preloadImages(0);
    }
  }, [currentIndex, images.length, loop, preloadImages]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'Escape':
          closeLightbox();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, prevImage, nextImage, closeLightbox]);

  // Focus trap for accessibility
  React.useEffect(() => {
    if (!(isOpen && lightboxRef.current)) return;

    const lightbox = lightboxRef.current;
    const focusableElements = Array.from(
      lightbox.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements.at(-1) as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    };

    lightbox.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      lightbox.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  // Handle image load completion
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      {/* Thumbnails */}
      <div className={cn('grid grid-cols-1 gap-4', className)} {...props}>
        {thumbnailImages.map(({ image, index }) => (
          <button
            className={cn(
              'cursor-pointer overflow-hidden rounded-lg border-0 bg-transparent p-0 text-left',
              thumbnailClassName
            )}
            key={index}
            onClick={() => openLightbox(index)}
            type="button"
          >
            {/** biome-ignore lint/performance/noImgElement: dynamic external URLs */}
            <img
              alt={image.alt}
              className={cn(
                'h-48 w-full object-cover transition-transform duration-300 hover:scale-110',
                thumbnailImgClassName
              )}
              ref={(el) => {
                thumbnailRefs.current[index] = el;
              }}
              src={image.src || '/placeholder.svg'}
            />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        // biome-ignore lint/nursery/noNoninteractiveElementInteractions lint/a11y/useKeyWithClickEvents: modal backdrop; Escape closes via window listener
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
          ref={lightboxRef}
          role="dialog"
        >
          {/* Close Button */}
          <button
            aria-label="Close lightbox"
            className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white transition-opacity hover:bg-black/70"
            onClick={closeLightbox}
            type="button"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Previous Button */}
          {(currentIndex > 0 || loop) && (
            <button
              aria-label="Previous image"
              className="-translate-y-1/2 absolute top-1/2 left-4 rounded-full bg-black/50 p-2 text-white transition-opacity hover:bg-black/70"
              onClick={prevImage}
              type="button"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
          )}

          {/* Next Button */}
          {(currentIndex < images.length - 1 || loop) && (
            <button
              aria-label="Next image"
              className="-translate-y-1/2 absolute top-1/2 right-4 rounded-full bg-black/50 p-2 text-white transition-opacity hover:bg-black/70"
              onClick={nextImage}
              type="button"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          )}

          {/* Image Container */}
          <div className="relative flex max-h-[90vh] max-w-[90vw] flex-col items-center">
            {/* Loading Spinner */}
            {isLoading && (
              <div
                className="absolute inset-0 flex items-center justify-center"
                data-testid="lightbox-loading-spinner"
              >
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
              </div>
            )}

            {/* Current Image */}
            {/** biome-ignore lint/performance/noImgElement lint/nursery/noNoninteractiveElementInteractions: full-size preview; onLoad toggles spinner */}
            <img
              alt={images[currentIndex].alt}
              className={cn(
                'max-h-[80vh] max-w-full object-contain transition-opacity duration-300',
                isLoading ? 'opacity-0' : 'opacity-100'
              )}
              onLoad={handleImageLoad}
              src={images[currentIndex].src || '/placeholder.svg'}
            />

            {/* Caption */}
            {images[currentIndex].caption && (
              <div className="mt-4 max-w-full px-4 text-center text-white">
                <p className="text-lg">{images[currentIndex].caption}</p>
              </div>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
