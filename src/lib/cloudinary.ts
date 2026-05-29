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

async function compressImageFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  const image = await loadImage(file);
  const maxWidth = 1920;
  const maxHeight = 1920;
  const scale = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return file;

  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", 0.88);
  });

  if (!blob) {
    return file;
  }

  const baseName = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${baseName}.webp`, { type: "image/webp" });
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for compression"));
    };
    image.src = url;
  });
}

export async function uploadToCloudinary(file: File, kind: CloudinaryUploadKind): Promise<CloudinaryUploadResult> {
  const uploadFile = await compressImageFile(file);
  const form = new FormData();
  form.append("file", uploadFile);
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
