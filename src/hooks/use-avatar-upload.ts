import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { authApi } from "@/lib/api";
import { useAvatar } from "@/contexts/AvatarContext";
import { toast } from "sonner";

export function useAvatarUpload() {
  const queryClient = useQueryClient();
  const { setAvatarUrl } = useAvatar();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Upload to Cloudinary
      const uploadResult = await uploadToCloudinary(file, "avatar");
      
      // Send to backend
      const response = await authApi.updateAvatar(uploadResult.secureUrl);
      
      return response;
    },
    onSuccess: (response) => {
      // Update local context
      if (response.profile?.avatarUrl) {
        setAvatarUrl(response.profile.avatarUrl);
      }
      
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/auth/me"] }),
        queryClient.invalidateQueries({ queryKey: ["/auth/me", "access"] }),
      ]);
      
      toast.success("Avatar updated successfully");
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Failed to upload avatar";
      toast.error(message);
    },
  });

  return uploadMutation;
}
