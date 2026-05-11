import { Link } from "react-router-dom";

interface PropertyImageGalleryProps {
  images: string[];
  propertyId: string;
  title: string;
}

export function PropertyImageGallery({ images, propertyId, title }: PropertyImageGalleryProps) {
  if (!images || images.length === 0) {
    return null;
  }

  // Show up to 4 images in the gallery
  const displayImages = images.slice(0, 4);
  const hasMore = images.length > 4;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Property Gallery</p>
      <Link to={`/properties/${propertyId}`} className="block group">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {displayImages.map((image, index) => (
            <div
              key={`${propertyId}-gallery-${index}`}
              className="relative overflow-hidden rounded-lg border border-border/60 aspect-square bg-muted/20 group/thumbnail"
            >
              <img
                src={image}
                alt={`${title} - Photo ${index + 1}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover/thumbnail:scale-110"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover/thumbnail:bg-black/20 transition-colors duration-300" />

              {/* "More" indicator on last image if there are more */}
              {hasMore && index === displayImages.length - 1 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 group-hover:bg-black/70 transition-colors">
                  <p className="text-sm font-semibold text-white">+{images.length - displayImages.length}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Link>
    </div>
  );
}
