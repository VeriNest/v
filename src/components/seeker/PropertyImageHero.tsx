import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface PropertyImageHeroProps {
  images: string[];
  propertyId: string;
  matchScore?: number;
  title: string;
  location?: string;
}

export function PropertyImageHero({ images, propertyId, matchScore = 80, title, location }: PropertyImageHeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasImages = images && images.length > 0;
  const currentImage = hasImages ? images[currentImageIndex] : null;

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Link to={`/properties/${propertyId}`} className="block group">
      <div className="relative overflow-hidden rounded-t-xl h-48 md:h-56 bg-gradient-to-br from-muted/50 to-muted/20">
        {hasImages ? (
          <>
            {/* Main Image */}
            <img
              src={currentImage!}
              alt={`${title} - Photo ${currentImageIndex + 1}`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />

            {/* Match Score Badge */}
            {matchScore !== undefined && (
              <div className="absolute top-3 right-3 rounded-full bg-primary/95 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white shadow-lg">
                {matchScore}%
              </div>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-3 left-3 rounded-full bg-black/40 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white">
              {currentImageIndex + 1} / {images.length}
            </div>

            {/* Navigation Arrows (visible on hover or when multiple images) */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/75 p-1.5 text-white transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/75 p-1.5 text-white transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </>
        ) : (
          /* Fallback when no images */
          <div className="h-full w-full flex flex-col items-center justify-center">
            <ImageOff className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-xs text-muted-foreground">No photos yet</p>
          </div>
        )}
      </div>
    </Link>
  );
}
