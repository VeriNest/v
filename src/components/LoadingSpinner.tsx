import React from 'react';

import { FullscreenLoader, OrbitLoader } from "@/components/Loaders";

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ fullScreen = false, size = 'md' }: LoadingSpinnerProps) {
  if (fullScreen) {
    return <FullscreenLoader status="Loading" />;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <OrbitLoader size={size} />
      <p className="text-xs text-muted-foreground">Loading...</p>
    </div>
  );
}

export function PageLoadingSpinner() {
  return <FullscreenLoader status="Loading your dashboard" />;
}
