import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ImagePlus, Trash2 } from "lucide-react";

import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { OrbitLoader, InlineSpinner } from "@/components/Loaders";
import { agentApi, propertiesApi } from "@/lib/api";
import { uploadToCloudinary } from "@/lib/cloudinary";

type EditPropertyModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string | null;
};

const VIDEO_EXTENSIONS = [".mp4", ".mov", ".webm", ".ogg", ".m4v", ".avi", ".mkv"];

function isVideoUrl(url: string) {
  const normalized = url.split("?")[0].toLowerCase();
  return VIDEO_EXTENSIONS.some((extension) => normalized.endsWith(extension));
}

export function EditPropertyModal({ open, onOpenChange, propertyId }: EditPropertyModalProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["/properties", propertyId, "edit"],
    queryFn: () => propertiesApi.getById(propertyId!),
    enabled: open && Boolean(propertyId),
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data || !open) return;
    const images = Array.isArray(data.images) ? data.images.map(String) : [];
    setTitle(String(data.title ?? ""));
    setDescription(String(data.description ?? ""));
    setPrice(String(data.price ?? ""));
    setMediaUrls(images);
    setCoverImageUrl(images.find((url) => !isVideoUrl(url)) ?? null);
  }, [data, open]);

  const imageUrls = useMemo(() => mediaUrls.filter((url) => !isVideoUrl(url)), [mediaUrls]);
  const orderedMediaUrls = useMemo(() => {
    if (!coverImageUrl || !mediaUrls.includes(coverImageUrl)) return mediaUrls;
    return [coverImageUrl, ...mediaUrls.filter((url) => url !== coverImageUrl)];
  }, [coverImageUrl, mediaUrls]);

  const maxRemovableExistingImages = useMemo(() => {
    const existing = Array.isArray(data?.images) ? data.images.length : 0;
    return Math.max(1, Math.floor(existing / 3));
  }, [data]);

  const handleUploadMedia = async (files: FileList | null) => {
    if (!files?.length) return;
    try {
      setUploadingMedia(true);
      const uploaded = await Promise.all(Array.from(files).map((file) => uploadToCloudinary(file, "property")));
      const uploadedUrls = uploaded.map((item) => item.secureUrl);
      setMediaUrls((prev) => [...prev, ...uploadedUrls]);
      setCoverImageUrl((prev) => prev ?? uploadedUrls.find((url) => !isVideoUrl(url)) ?? null);
      toast.success(`${uploadedUrls.length} media file${uploadedUrls.length === 1 ? "" : "s"} uploaded`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to upload property media";
      toast.error(message);
    } finally {
      setUploadingMedia(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveMedia = (url: string) => {
    const next = mediaUrls.filter((item) => item !== url);
    setMediaUrls(next);
    if (coverImageUrl === url) {
      setCoverImageUrl(next.find((item) => !isVideoUrl(item)) ?? null);
    }
  };

  const handleSave = async () => {
    if (!propertyId) return;
    if (!title.trim()) {
      toast.error("Property title is required.");
      return;
    }
    if (imageUrls.length === 0) {
      toast.error("Keep at least one image on the property.");
      return;
    }

    try {
      setSaving(true);
      const response = await agentApi.updateProperty(propertyId, {
        title: title.trim(),
        description: description.trim(),
        price: Number(String(price).replace(/[^0-9]/g, "")) || 0,
        images: orderedMediaUrls,
      });
      queryClient.invalidateQueries({ queryKey: ["/agent/properties"] });
      queryClient.invalidateQueries({ queryKey: ["/properties", propertyId] });
      queryClient.invalidateQueries({ queryKey: ["/properties", propertyId, "edit"] });
      toast.success(String((response as any)?.message ?? "Property updated successfully."));
      onOpenChange(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update property";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Edit Property</SheetTitle>
          <SheetDescription>
            Update your description, asking price, and media gallery. The selected cover image will be used across listing cards.
          </SheetDescription>
        </SheetHeader>

        {isLoading || !data ? (
          <div className="flex min-h-[50vh] items-center justify-center">
            <OrbitLoader size="sm" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Property title</label>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="3 Bedroom Flat, Lekki" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                placeholder="Describe the property, finishes, and location context."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Price</label>
              <Input
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                inputMode="numeric"
                placeholder="2500000"
              />
              <p className="text-xs text-muted-foreground">
                Lower prices update immediately. If you increase the price, the backend may hold it for admin review.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Property media</p>
                  <p className="text-xs text-muted-foreground">
                    You can remove up to {maxRemovableExistingImages} of the current images in one edit and must keep at least one image.
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploadingMedia}>
                  {uploadingMedia ? <OrbitLoader size="sm" /> : <ImagePlus className="mr-1.5 h-4 w-4" />}
                  Upload more
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={(event) => void handleUploadMedia(event.target.files)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {mediaUrls.map((url) => {
                  const isVideo = isVideoUrl(url);
                  const isCover = !isVideo && coverImageUrl === url;
                  return (
                    <div key={url} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-muted/20">
                      {isVideo ? (
                        <video src={url} className="h-32 w-full object-cover" muted playsInline controls />
                      ) : (
                        <img src={url} alt="Property media" className="h-32 w-full object-cover" />
                      )}
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/85 via-black/35 to-transparent px-2 pb-2 pt-8">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90">
                          {isVideo ? "Video" : isCover ? "Cover photo" : "Image"}
                        </span>
                        {!isVideo && !isCover ? (
                          <button
                            type="button"
                            onClick={() => setCoverImageUrl(url)}
                            className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-slate-900 transition hover:bg-white"
                          >
                            Set cover
                          </button>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(url)}
                        className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black"
                        aria-label="Remove media"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={() => void handleSave()} disabled={saving || isLoading || !data}>
            {saving ? <><InlineSpinner variant="solid" /> Saving...</> : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
