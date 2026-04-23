export type CloudinaryUploadKind = "avatar" | "document" | "property";

export type CloudinaryUploadResult = {
  secureUrl: string;
  publicId: string;
  resourceType: string;
  format?: string | null;
  bytes?: number;
  originalFilename?: string | null;
};

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? "dui0hakkq";

const PRESETS: Record<CloudinaryUploadKind, string> = {
  avatar: import.meta.env.VITE_CLOUDINARY_AVATAR_PRESET ?? "verinest_selfies",
  document: import.meta.env.VITE_CLOUDINARY_DOCUMENT_PRESET ?? "verinest_documents",
  property: import.meta.env.VITE_CLOUDINARY_PROPERTY_PRESET ?? "verinest_portfolio",
};

export async function uploadToCloudinary(file: File, kind: CloudinaryUploadKind): Promise<CloudinaryUploadResult> {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", PRESETS[kind]);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
    method: "POST",
    body: form,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message ?? "Cloudinary upload failed";
    throw new Error(message);
  }

  return {
    secureUrl: payload.secure_url,
    publicId: payload.public_id,
    resourceType: payload.resource_type,
    format: payload.format ?? null,
    bytes: payload.bytes,
    originalFilename: payload.original_filename ?? null,
  };
}
