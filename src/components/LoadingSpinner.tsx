import React from 'react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ fullScreen = false, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const spinner = (
    <div className={`relative ${sizeClasses[size]}`}>
      {/* Verinest Logo-based spinner */}
      <svg
        className="w-full h-full animate-spin"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* House shape with animated stroke */}
        <defs>
          <style>
            {`
              @keyframes verinest-spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
              .verinest-spinner {
                animation: verinest-spin 2s linear infinite;
              }
            `}
          </style>
        </defs>
        <g className="verinest-spinner" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          {/* Roof */}
          <path
            d="M3 12 L12 4 L21 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-amber-600"
            strokeDasharray="24"
            strokeDashoffset="12"
          />
          {/* House body */}
          <rect
            x="4"
            y="12"
            width="16"
            height="8"
            rx="1"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-amber-600"
            strokeDasharray="36"
            strokeDashoffset="18"
          />
        </g>
      </svg>

      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50">
        {spinner}
        <p className="mt-4 text-sm font-medium text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      {spinner}
      <p className="text-xs text-muted-foreground">Loading...</p>
    </div>
  );
}

export function PageLoadingSpinner() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 relative">
            {/* Verinest Logo Spinner */}
            <svg
              className="w-full h-full animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <style>
                  {`
                    @keyframes verinest-pulse {
                      0%, 100% { opacity: 1; }
                      50% { opacity: 0.5; }
                    }
                    .verinest-logo {
                      animation: spin 3s linear infinite;
                    }
                  `}
                </style>
              </defs>
              <g className="verinest-logo">
                {/* Roof */}
                <path
                  d="M3 12 L12 4 L21 12"
                  stroke="#C4714A"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                {/* House body */}
                <rect
                  x="4"
                  y="12"
                  width="16"
                  height="8"
                  rx="1"
                  stroke="#C4714A"
                  strokeWidth="2.5"
                  fill="none"
                />
                {/* Door */}
                <rect
                  x="10"
                  y="14"
                  width="4"
                  height="6"
                  rx="0.5"
                  fill="#C4714A"
                  opacity="0.3"
                />
              </g>
            </svg>
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">Verinest</h2>
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    </div>
  );
}
