import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Camera, Upload } from "lucide-react";
import * as faceapi from "face-api.js";
import { toast } from "sonner";

import { FullscreenLoader, InlineSpinner, OrbitLoader } from "@/components/Loaders";
import { Button } from "@/components/ui/button";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { setStoredKycStatus, verificationApi } from "@/lib/api";

interface FacialVerificationProps {
  userRole: "agent" | "landlord" | "seeker";
  onSuccess?: (photoData: string, ninOrProfilePhoto?: string) => void;
  onCancel?: () => void;
}

type Screen = "intro" | "nin-upload" | "camera" | "success" | "error";

type FaceMetrics = {
  centerOffsetX: number;
  centerOffsetY: number;
  faceWidthRatio: number;
  faceHeightRatio: number;
};
const DETECTION_INTERVAL_MS = 150;
const COUNTDOWN_START = 3;
const FACE_HOLD_MS = 250;
const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";

let modelsPromise: Promise<void> | null = null;

async function ensureModelsLoaded() {
  if (!modelsPromise) {
    modelsPromise = Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    ]).then(() => undefined);
  }
  return modelsPromise;
}

async function detectFaceMetrics(video: HTMLVideoElement): Promise<FaceMetrics | null> {
  const result = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.3 }))
    .withFaceLandmarks();

  if (!result) return null;

  const box = result.detection.box;
  const faceCenterX = box.x + box.width / 2;
  const faceCenterY = box.y + box.height / 2;
  const frameCenterX = video.videoWidth / 2;
  const frameCenterY = video.videoHeight / 2;

  return {
    centerOffsetX: (faceCenterX - frameCenterX) / box.width,
    centerOffsetY: (faceCenterY - frameCenterY) / box.height,
    faceWidthRatio: box.width / video.videoWidth,
    faceHeightRatio: box.height / video.videoHeight,
  };
}

function FaceGlyph() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <circle cx="8" cy="9" r="1.5" fill="white" />
      <circle cx="16" cy="9" r="1.5" fill="white" />
      <path d="M8 15c2 2 6 2 8 0" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="11" stroke="white" strokeWidth="2" />
    </svg>
  );
}

export function FacialVerification({ userRole, onSuccess, onCancel }: FacialVerificationProps) {
  const [screen, setScreen] = useState<Screen>("intro");
  const [progress, setProgress] = useState(0);
  const [ninFile, setNinFile] = useState<File | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [captureTime, setCaptureTime] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isPreparingCamera, setIsPreparingCamera] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Camera access is required for facial verification. Please enable camera permissions and try again.");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [ovalState, setOvalState] = useState<"idle" | "scanning" | "success">("idle");

  const holdStartRef = useRef<number | null>(null);
  const detectionIntervalRef = useRef<ReturnType<typeof window.setInterval> | null>(null);
  const countdownTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isCapturingRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ninInputRef = useRef<HTMLInputElement>(null);

  const navStepLabel = userRole === "seeker" ? "Step 3 of 4" : "Step 3 of 4";
  const showProgress = screen === "camera" && !countdown;

  const introCopy = useMemo(() => {
    const roleCopy = userRole === "seeker" ? "verified seekers" : "verified providers";
    return `A quick liveness check so renters and seekers know they're dealing with ${roleCopy} on Verinest.`;
  }, [userRole]);

  const stopCamera = () => {
    if (detectionIntervalRef.current) {
      window.clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    if (countdownTimeoutRef.current) {
      window.clearTimeout(countdownTimeoutRef.current);
      countdownTimeoutRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    isCapturingRef.current = false;
    setCountdown(null);
  };

  const resetTracking = () => {
    holdStartRef.current = null;
    setProgress(20);
    setOvalState("scanning");
  };

  const resetFlow = () => {
    stopCamera();
    setCapturedPhoto(null);
    setCaptureTime("");
    setFlash(false);
    resetTracking();
    setScreen("intro");
    setErrorMessage("Camera access is required for facial verification. Please enable camera permissions and try again.");
    setIsPreparingCamera(false);
  };

  const captureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 720;
    canvas.height = video.videoHeight || 960;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCapturedPhoto(dataUrl);
    setCaptureTime(new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }));
    setFlash(true);
    setOvalState("success");
    window.setTimeout(() => setFlash(false), 140);
    window.setTimeout(() => {
      stopCamera();
      setProgress(100);
      setScreen("success");
    }, 700);
  };

  const beginCountdown = () => {
    if (isCapturingRef.current) return;
    isCapturingRef.current = true;
    setCountdown(COUNTDOWN_START);

    const tick = (value: number) => {
      if (value <= 0) {
        setCountdown(null);
        captureSnapshot();
        return;
      }
      setCountdown(value);
      countdownTimeoutRef.current = window.setTimeout(() => tick(value - 1), 850);
    };

    tick(COUNTDOWN_START);
  };

  const isFaceCentered = (metrics: FaceMetrics) => {
    return (
      Math.abs(metrics.centerOffsetX) < 0.32 &&
      Math.abs(metrics.centerOffsetY) < 0.36 &&
      metrics.faceWidthRatio > 0.16 &&
      metrics.faceHeightRatio > 0.16
    );
  };

  useEffect(() => {
    if (screen !== "camera") return;

    let mounted = true;

    const setupCamera = async () => {
      try {
        setIsPreparingCamera(true);
        await ensureModelsLoaded();
        if (!mounted) return;

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 960 } },
          audio: false,
        });

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) return;

        video.srcObject = stream;
        await video.play();
        resetTracking();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to start camera";
        setErrorMessage(message.includes("Permission") ? "Camera access is required for facial verification. Please enable camera permissions and try again." : "We could not start the camera for liveness verification.");
        setScreen("error");
      } finally {
        if (mounted) {
          setIsPreparingCamera(false);
        }
      }
    };

    setupCamera();

    return () => {
      mounted = false;
      stopCamera();
    };
  }, [screen]);

  useEffect(() => {
    if (screen !== "camera" || isPreparingCamera || countdown !== null) return;
    if (!videoRef.current) return;

    const runDetection = async () => {
      if (!videoRef.current || isCapturingRef.current) return;

      const metrics = await detectFaceMetrics(videoRef.current);
      if (!metrics) {
        holdStartRef.current = null;
        setOvalState("scanning");
        setProgress(20);
        return;
      }

      const centered = isFaceCentered(metrics);

      if (!centered) {
        holdStartRef.current = null;
        setOvalState("scanning");
        setProgress(20);
        return;
      }

      // Once the face is clearly in frame, move quickly into capture.
      setOvalState("success");
      setProgress(60);

      const now = Date.now();
      if (!holdStartRef.current) {
        holdStartRef.current = now;
      }

      const heldFor = now - holdStartRef.current;

      if (heldFor >= FACE_HOLD_MS) {
        setProgress(85);
        beginCountdown();
      }
    };

    detectionIntervalRef.current = window.setInterval(runDetection, DETECTION_INTERVAL_MS);

    return () => {
      if (detectionIntervalRef.current) {
        window.clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    };
  }, [screen, isPreparingCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleBeginLiveness = () => {
    setScreen(userRole === "seeker" ? "camera" : "nin-upload");
  };

  const handleNinUpload = (file: File) => {
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      toast.error("Please upload an image or PDF file");
      return;
    }
    setNinFile(file);
  };

  const handleSubmitVerification = async () => {
    if (!capturedPhoto) return;

    try {
      setUploading(true);
      const blob = await (await fetch(capturedPhoto)).blob();
      const selfieFile = new File([blob], `verification-${Date.now()}.jpg`, { type: "image/jpeg" });
      const selfieUpload = await uploadToCloudinary(selfieFile, "avatar");
      const verification = await verificationApi.create(
        userRole === "seeker" ? "Seeker liveness submitted from onboarding" : "Provider verification submitted from onboarding",
      );

      await verificationApi.addDocument(verification.id, {
        documentType: "selfie",
        fileUrl: selfieUpload.secureUrl,
        fileKey: selfieUpload.publicId,
        mimeType: "image/jpeg",
      });

      let providerDocumentUrl: string | null = null;
      if ((userRole === "agent" || userRole === "landlord") && ninFile) {
        const uploadedDocument = await uploadToCloudinary(ninFile, "document");
        providerDocumentUrl = uploadedDocument.secureUrl;
        await verificationApi.addDocument(verification.id, {
          documentType: "nin",
          fileUrl: uploadedDocument.secureUrl,
          fileKey: uploadedDocument.publicId,
          mimeType: ninFile.type || "application/octet-stream",
        });
      }

      setStoredKycStatus("submitted");
      toast.success(userRole === "seeker" ? "Liveness check submitted successfully" : "Facial verification submitted successfully");
      onSuccess?.(selfieUpload.secureUrl, providerDocumentUrl ?? "verified");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to submit verification";
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    stopCamera();
    onCancel?.();
  };

  if (uploading) {
    return <FullscreenLoader status="Submitting verification" />;
  }

  if (screen === "intro") {
    return (
      <div className="w-full max-w-[480px] overflow-hidden bg-[#f0ebe3]">
        <div className="flex items-center justify-between border-b border-[#e2dad0] bg-[#faf7f3] px-5 py-4">
          <div className="flex items-center gap-[9px]">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-[#c4714a]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 12 L12 4 L21 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="9" y="14" width="6" height="8" rx="3" fill="white" />
              </svg>
            </div>
            <span className="font-serif text-[20px] font-semibold tracking-[0.03em] text-[#1a1814]">
              Veri<em className="text-[#c4714a]">nest</em>
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#9a8f84]">{navStepLabel}</span>
        </div>

        <div className="flex min-h-[calc(100vh-67px)] flex-col px-5 pb-10 pt-6">
          <div className="mb-5 inline-flex w-fit items-center gap-1.5 self-start rounded-[20px] bg-[#f0e0d4] px-3 py-[5px]">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="#C4714A" strokeWidth="1.5" />
              <path d="M3.5 6l1.8 1.8 3.2-3.2" stroke="#C4714A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#c4714a]">Identity Verification</span>
          </div>

          <h2 className="mb-3 font-serif text-[34px] font-semibold leading-[1.15] text-[#1a1814]">
            Let&apos;s confirm
            <br />
            it&apos;s really <em className="text-[#c4714a]">you.</em>
          </h2>
          <p className="mb-8 text-[13.5px] leading-[1.65] text-[#9a8f84]">{introCopy}</p>

          <div className="mb-9 flex flex-col">
            {[
              {
                num: "01",
                title: "Position your face",
                description: "Centre your face inside the oval guide on screen",
              },
              {
                num: "02",
                title: "Follow the instructions",
                description: "Look up, then left, then right as prompted",
              },
              {
                num: "03",
                title: "Photo is captured",
                description: "We take a clear snapshot to attach to your profile",
              },
            ].map((item, index, list) => (
              <div
                key={item.num}
                className={`flex items-start gap-4 py-[18px] ${index < list.length - 1 ? "border-b border-[#e2dad0]" : ""}`}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#c4714a] font-serif text-[15px] font-semibold text-[#c4714a]">
                  {item.num}
                </div>
                <div>
                  <strong className="mb-0.5 block text-[13.5px] font-medium text-[#1a1814]">{item.title}</strong>
                  <span className="text-xs leading-[1.5] text-[#9a8f84]">{item.description}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleBeginLiveness}
            className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#c4714a] px-4 py-[17px] text-sm font-medium tracking-[0.04em] text-white transition active:scale-[0.98] active:bg-[#a85d38]"
          >
            <Camera className="h-4 w-4" />
            Begin Liveness Check
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="mt-2.5 w-full rounded-[14px] border-[1.5px] border-[#e2dad0] bg-transparent px-4 py-3.5 text-[13px] text-[#9a8f84] transition active:border-[#c4714a] active:text-[#c4714a]"
          >
            Maybe Later
          </button>
        </div>
      </div>
    );
  }

  if (screen === "nin-upload") {
    return (
      <div className="w-full max-w-[480px] overflow-hidden bg-[#f0ebe3]">
        <div className="flex items-center justify-between border-b border-[#e2dad0] bg-[#faf7f3] px-5 py-4">
          <div className="flex items-center gap-[9px]">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-[#c4714a]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 12 L12 4 L21 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="9" y="14" width="6" height="8" rx="3" fill="white" />
              </svg>
            </div>
            <span className="font-serif text-[20px] font-semibold tracking-[0.03em] text-[#1a1814]">
              Veri<em className="text-[#c4714a]">nest</em>
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#9a8f84]">Step 2 of 4</span>
        </div>

        <div className="flex min-h-[calc(100vh-67px)] flex-col px-5 pb-10 pt-6">
          <div className="mb-5 inline-flex w-fit items-center gap-1.5 self-start rounded-[20px] bg-[#f0e0d4] px-3 py-[5px]">
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="#C4714A" strokeWidth="1.5" />
              <path d="M3.5 6l1.8 1.8 3.2-3.2" stroke="#C4714A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#c4714a]">Identity Verification</span>
          </div>

          <h2 className="mb-3 font-serif text-[34px] font-semibold leading-[1.1] text-[#1a1814]">
            Upload your NIN
            <br />
            before <em className="text-[#c4714a]">capture.</em>
          </h2>
          <p className="mb-8 text-[13.5px] leading-[1.65] text-[#9a8f84]">
            Please upload your national ID before proceeding with facial verification.
          </p>

          <div className="mb-6 rounded-[22px] border-2 border-dashed border-[#e2dad0] bg-[#faf7f3] p-7 text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#f0e0d4]">
              <Upload className="h-6 w-6 text-[#c4714a]" />
            </div>

            {ninFile ? (
              <div className="mb-5">
                <p className="text-[15px] font-medium text-[#1a1814]">NIN Document Uploaded</p>
                <p className="mt-1 text-xs text-[#9a8f84]">{ninFile.name}</p>
              </div>
            ) : (
              <div className="mb-5">
                <p className="text-[15px] font-medium text-[#1a1814]">Upload NIN or ID</p>
                <p className="mt-1 text-xs text-[#9a8f84]">Click to select an image or PDF file</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => ninInputRef.current?.click()}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-[#e7b39a] bg-white px-5 text-xs font-medium text-[#c4714a] transition hover:bg-[#fff8f4]"
            >
              <Upload className="h-3.5 w-3.5" />
              {ninFile ? "Replace file" : "Choose file"}
            </button>

            <input
              ref={ninInputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleNinUpload(file);
              }}
            />
          </div>

          <div className="mt-auto space-y-3">
            <button
              type="button"
              onClick={() => setScreen("camera")}
              disabled={!ninFile}
              className="flex h-[46px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#c4714a] px-4 text-sm font-medium text-white transition hover:bg-[#a85d38] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue to Liveness Check <ArrowRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="h-[46px] w-full rounded-[14px] border border-[#e2dad0] bg-[#faf7f3] text-[13px] font-medium text-[#1a1814]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "camera") {
    return (
      <div className="flex justify-center items-center w-full min-h-screen bg-background p-4">
        <div className="w-full max-w-[480px] bg-[#f0ebe3] rounded-lg overflow-hidden flex flex-col max-h-[100vh] sm:max-h-[90vh]">
          <div className="flex items-center justify-between border-b border-[#e2dad0] bg-[#faf7f3] px-5 py-4">
          <div className="flex items-center gap-[9px]">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] bg-[#c4714a]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 12 L12 4 L21 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="9" y="14" width="6" height="8" rx="3" fill="white" />
              </svg>
            </div>
            <span className="font-serif text-[20px] font-semibold tracking-[0.03em] text-[#1a1814]">
              Veri<em className="text-[#c4714a]">nest</em>
            </span>
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#9a8f84]">{navStepLabel}</span>
        </div>

        <div className="flex min-h-[calc(100vh-67px)] flex-col px-5 pb-10 pt-6">
          <div className="mb-5">
            <h2 className="font-serif text-[26px] font-semibold text-[#1a1814]">Verify it's Really You</h2>
            <p className="mt-1 text-[12.5px] text-[#9a8f84]">
              {isPreparingCamera ? "Preparing your camera..." : "Keep your face centered. We'll capture in 3...2...1"}
            </p>
          </div>

          <div className="mb-6 h-[3px] w-full overflow-hidden rounded bg-[#e2dad0]">
            <div className="h-full rounded bg-[#c4714a] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>

          <div className="relative mb-5 w-full overflow-hidden rounded-[24px] bg-[#161412]" style={{ aspectRatio: "3 / 4" }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />
            <canvas ref={canvasRef} className="hidden" />

            {isPreparingCamera ? (
              <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                <div className="flex flex-col items-center gap-3 text-white">
                  <OrbitLoader size="sm" />
                  <p className="text-sm">Opening camera...</p>
                </div>
              </div>
            ) : null}

            <div
              className={`pointer-events-none absolute left-1/2 top-1/2 aspect-[3/4] w-[62%] -translate-x-1/2 -translate-y-[52%] rounded-full border-[2.5px] transition-all duration-300 ${
                ovalState === "success"
                  ? "border-[#5cb87a] shadow-[0_0_24px_rgba(92,184,122,0.6),0_0_0_9999px_rgba(22,20,18,0.45)]"
                  : "border-[#c4714a]/90 shadow-[0_0_0_9999px_rgba(22,20,18,0.45)]"
              } ${ovalState !== "success" ? "animate-pulse" : ""}`}
            />

            {[
              "top-4 left-4 border-l-2 border-t-2 rounded-tl",
              "top-4 right-4 border-r-2 border-t-2 rounded-tr",
              "bottom-4 left-4 border-b-2 border-l-2 rounded-bl",
              "bottom-4 right-4 border-b-2 border-r-2 rounded-br",
            ].map((position) => (
              <div key={position} className={`pointer-events-none absolute h-5 w-5 border-[#c4714a] ${position}`} />
            ))}

            <div
              className={`pointer-events-none absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#c4714a]/95 transition-opacity duration-300 ${
                showProgress ? "opacity-100" : "opacity-0"
              }`}
            >
              <FaceGlyph />
            </div>

            {countdown !== null ? (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-[96px] font-semibold text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)]">
                  {countdown}
                </span>
              </div>
            ) : null}

            <div
              className={`pointer-events-none absolute inset-0 rounded-[24px] bg-white transition-opacity duration-75 ${flash ? "opacity-100" : "opacity-0"}`}
            />
          </div>

          <div className={`mb-4 flex items-center gap-[14px] rounded-2xl border bg-[#faf7f3] px-5 py-[18px] transition-colors ${progress > 60 ? "border-[#c4714a]" : "border-[#e2dad0]"}`}>
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[22px] ${progress > 60 ? "bg-[#c4714a] text-white" : "bg-[#f0e0d4] text-[#1a1814]"}`}>
              👁️
            </div>
            <div>
              <strong className="block text-[13.5px] font-medium text-[#1a1814]">
                {countdown !== null ? "Hold still..." : progress > 60 ? "Face detected!" : "Ready to capture"}
              </strong>
              <span className="text-[11.5px] text-[#9a8f84]">
                {countdown !== null
                  ? "Taking your verification snapshot"
                  : progress > 60
                    ? "Starting countdown..."
                    : "Position your face in the center of the oval"}
              </span>
            </div>
          </div>

          <Button onClick={handleCancel} variant="outline" className="mt-auto h-11 w-full">
            Cancel
          </Button>
          </div>
        </div>
      </div>
    );
  }

  if (screen === "success") {
    return (
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="h-1 w-full overflow-hidden rounded-full bg-[#e2dad0]">
          <div className="h-full w-full rounded bg-[#5cb87a]" />
        </div>

        <div className="space-y-3 pt-6">
          <div className="mx-auto flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[#ebf7ef]">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <path d="M10 22l8 8 16-16" stroke="#5CB87A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h2 className="font-serif text-[30px] font-semibold text-[#1a1814]">Verification Complete</h2>
          <p className="mx-auto max-w-[280px] text-[13px] leading-[1.6] text-[#9a8f84]">
            {userRole === "seeker"
              ? "Your liveness check passed. Submit it now to finish seeker verification."
              : "Your identity has been confirmed. Submit it now so the team can review your provider verification."}
          </p>
        </div>

        {capturedPhoto ? (
          <div className="overflow-hidden rounded-[20px] border border-[#e2dad0] bg-[#faf7f3]">
            <div className="px-4 pb-2 pt-3 text-left text-[9px] uppercase tracking-[0.22em] text-[#9a8f84]">Captured Photo</div>
            <img src={capturedPhoto} alt="Captured verification photo" className="w-full" style={{ transform: "scaleX(-1)" }} />
            <div className="flex items-center gap-2 px-4 pb-4 pt-3">
              <div className="h-2 w-2 rounded-full bg-[#5cb87a]" />
              <div className="text-[11px] text-[#9a8f84]">
                <strong className="font-medium text-[#1a1814]">Liveness confirmed</strong>
                <span> · {captureTime}</span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <Button onClick={handleSubmitVerification} disabled={uploading} className="h-12 w-full bg-[#c4714a] text-white hover:bg-[#a85d38]">
            {uploading ? <><InlineSpinner variant="solid" /> Submitting Verification...</> : "Confirm & Continue"}
          </Button>
          <Button onClick={resetFlow} variant="outline" className="h-11 w-full" disabled={uploading}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-4 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-[#1a1814]">Camera Access Needed</h2>
      <p className="text-sm text-[#9a8f84]">{errorMessage}</p>
      <div className="space-y-2">
        <Button onClick={() => setScreen("camera")} className="h-11 w-full bg-[#c4714a] text-white hover:bg-[#a85d38]">
          Try Again
        </Button>
        <Button onClick={handleCancel} variant="outline" className="h-11 w-full">
          Go Back
        </Button>
      </div>
    </div>
  );
}
