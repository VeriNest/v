import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Home, Search, Building2, ArrowRight, CheckCircle2,
  MapPin, Phone, Briefcase, Shield, Sparkles, ChevronRight,
  User, Mail, Wallet, Clock, Star, HomeIcon, BadgeCheck,
  Upload, FileText, ShieldCheck, AlertTriangle, Camera, X
} from "lucide-react";
import { FullscreenLoader, OrbitLoader } from "@/components/Loaders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { authApi, dashboardPathForRole, getStoredSession, onboardingApi, resolveAuthenticatedPath, setStoredKycStatus, setStoredSession, verificationApi } from "@/lib/api";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { FacialVerification } from "@/components/provider/FacialVerification";

type Role = "seeker" | "agent" | "landlord";

const roleCards: { value: Role; icon: React.ElementType; label: string; desc: string }[] = [
  { value: "seeker", icon: Search, label: "Find a home", desc: "Browse listings, post needs, and get matched with verified agents." },
  { value: "agent", icon: Briefcase, label: "I'm an agent", desc: "List properties, manage leads, and grow your rental business." },
  { value: "landlord", icon: Building2, label: "I own property", desc: "List your properties directly and connect with quality tenants." },
];

const agentDocs = [
  { label: "National ID (NIN)", desc: "Government-issued NIN slip or national ID card", icon: FileText },
  { label: "CAC Certificate", desc: "Business registration certificate (if applicable)", icon: FileText },
];

const landlordDocs = [
  { label: "National ID (NIN)", desc: "Government-issued NIN slip or national ID card", icon: FileText },
  { label: "Property Deed / C of O", desc: "Certificate of occupancy or property ownership document", icon: FileText },
];

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River",
  "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT",
].sort();

export default function Onboarding() {
  const navigate = useNavigate();
  const session = getStoredSession();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role | null>(null);
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [operatingState, setOperatingState] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedPropertyCount, setSelectedPropertyCount] = useState("");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [selectedTimeline, setSelectedTimeline] = useState("");
  const [selectedAgentStatus, setSelectedAgentStatus] = useState("");
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, boolean>>({});
  const [uploadedDocFiles, setUploadedDocFiles] = useState<Record<string, { fileUrl: string; fileKey: string; mimeType: string }>>({});
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const [activeDocLabel, setActiveDocLabel] = useState<string | null>(null);
  
  // Seeker NIN verification
  const [ninNumber, setNinNumber] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Agent/Landlord facial verification
  const [facialVerificationComplete, setFacialVerificationComplete] = useState(false);
  const [verificationPhotoUrl, setVerificationPhotoUrl] = useState<string | null>(null);
  const { data: me, isLoading } = useQuery({
    queryKey: ["/auth/me", "onboarding"],
    queryFn: () => authApi.me(),
    enabled: Boolean(session?.token),
    retry: 0,
  });

  const isProvider = role === "agent" || role === "landlord";
  const totalSteps = role === "seeker" ? 4 : role === "agent" ? 4 : role === "landlord" ? 4 : 3;
  const successStep = role === "seeker" ? 4 : role === "agent" || role === "landlord" ? 4 : 3;
  const kycStep = isProvider ? 3 : role === "seeker" ? 3 : null;

  const handleComplete = () => {
    // Enforce verification requirements before allowing dashboard access
    if (!role) {
      toast.error("Role not selected");
      return;
    }

    // For agents and landlords: require both document upload and facial verification
    if ((role === "agent" || role === "landlord") && (!uploadedDocFiles["National ID (NIN)"] || !facialVerificationComplete)) {
      toast.error("Please complete document upload and facial verification before continuing", {
        description: "Both NIN document and liveness check are required",
      });
      return;
    }

    // For seekers: require facial verification
    if (role === "seeker" && !facialVerificationComplete) {
      toast.error("Please complete the liveness check before continuing", {
        description: "Facial verification is required for all users",
      });
      return;
    }

    // Additional check: verify the backend confirms verification status
    if (me?.verification?.status && me.verification.status.toLowerCase() !== "verified" && me.verification.status.toLowerCase() !== "approved") {
      toast.error("Verification not yet approved by backend", {
        description: "Please wait a moment or refresh the page",
      });
      return;
    }

    // All checks passed - proceed to dashboard
    navigate(dashboardPathForRole(role));
  };

  useEffect(() => {
    if (!session?.token) {
      navigate("/login", { replace: true });
      return;
    }

    if (!me) return;

    const resolvedPath = resolveAuthenticatedPath(me);
    if (resolvedPath !== "/onboarding") {
      navigate(resolvedPath, { replace: true });
      return;
    }

    if (me.user.role === "unassigned") return;

    const nextRole = me.user.role as Role;
    setRole((current) => current ?? nextRole);

    if (me.profile?.onboardingCompleted) {
      setStep(3);
    } else {
      setStep((current) => Math.max(current, 2));
    }
  }, [me, navigate, session?.token]);

  const handleRoleContinue = async () => {
    if (!role) return;
    try {
      if (me?.user.role === role) {
        setStep(2);
        return;
      }
      await onboardingApi.selectRole(role);
      const session = window.localStorage.getItem("verinest_session");
      if (session) {
        const parsed = JSON.parse(session);
        setStoredSession({ ...parsed, user: { ...parsed.user, role } });
      }
      setStep(2);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save role";
      toast.error(message);
    }
  };

  const handleProfileContinue = async () => {
    if (!role) return;
    try {
      const payload = role === "seeker"
        ? {
            role,
            phone,
            city,
            preferredCity: city,
            preferredAccommodationType: selectedType,
            preferredBudgetLabel: selectedBudget,
            moveInTimeline: selectedTimeline,
          }
        : role === "agent"
          ? {
              role,
              phone,
              city,
              operatingState,
              companyName,
              experienceRange: experience,
              specializations: selectedPropertyTypes,
              bio,
            }
          : {
              role,
              phone,
              city,
              propertyCountRange: selectedPropertyCount,
              propertyTypes: selectedPropertyTypes,
              currentAgentStatus: selectedAgentStatus,
            };
      const me = await onboardingApi.saveProfile(payload);
      setStoredKycStatus(me.verification?.status ?? null);
      if (me.user) {
        const session = window.localStorage.getItem("verinest_session");
        if (session) {
          const parsed = JSON.parse(session);
          setStoredSession({ ...parsed, user: { ...parsed.user, role } });
        }
      }
      setStep(kycStep ?? successStep);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save onboarding details";
      toast.error(message);
    }
  };

  const handleSkipKyc = () => {
    setStoredKycStatus("skipped");
    setStep(successStep);
  };

  const handleSubmitKyc = async () => {
    try {
      const verification = await verificationApi.create("KYC submitted from onboarding");
      const docsToUpload = docs.filter((doc) => uploadedDocFiles[doc.label]);
      for (const doc of docsToUpload) {
        const uploaded = uploadedDocFiles[doc.label];
        if (!uploaded) continue;
        await verificationApi.addDocument(verification.id, {
          documentType: doc.label.toLowerCase().includes("cac") ? "cac_certificate" : doc.label.toLowerCase().includes("deed") ? "property_deed_or_cofo" : "nin",
          fileUrl: uploaded.fileUrl,
          fileKey: uploaded.fileKey,
          mimeType: uploaded.mimeType,
        });
      }
      setStoredKycStatus("submitted");
      setStep(successStep);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit verification";
      toast.error(message);
    }
  };

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      toast.error("Unable to access camera. Please check permissions.");
    }
  };

  const handleCaptureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL("image/jpeg");
        handleSelfieUpload(imageData);
      }
    }
  };

  const handleSelfieUpload = async (imageData: string) => {
    try {
      setUploadingDoc("selfie");
      // Convert data URL to blob
      const response = await fetch(imageData);
      const blob = await response.blob();
      const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
      
      const uploaded = await uploadToCloudinary(file, "document");
      setUploadedDocFiles((prev) => ({
        ...prev,
        selfie: {
          fileUrl: uploaded.secureUrl,
          fileKey: uploaded.publicId,
          mimeType: "image/jpeg",
        },
      }));
      setUploadedDocs(prev => ({ ...prev, selfie: true }));
      
      // Stop camera
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      setCameraActive(false);
      toast.success("Selfie captured successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to upload selfie";
      toast.error(message);
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleStopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  const handleSubmitSeekerKyc = async () => {
    if (!ninNumber.trim()) {
      toast.error("Please enter your NIN");
      return;
    }
    if (!uploadedDocFiles["NIN Document"]) {
      toast.error("Please upload NIN document");
      return;
    }
    if (!uploadedDocFiles["selfie"]) {
      toast.error("Please take a selfie");
      return;
    }

    try {
      const verification = await verificationApi.create("Seeker KYC submitted from onboarding");
      
      // Upload NIN document
      const ninDoc = uploadedDocFiles["NIN Document"];
      await verificationApi.addDocument(verification.id, {
        documentType: "nin",
        fileUrl: ninDoc.fileUrl,
        fileKey: ninDoc.fileKey,
        mimeType: ninDoc.mimeType,
      });

      // Upload selfie
      const selfie = uploadedDocFiles["selfie"];
      await verificationApi.addDocument(verification.id, {
        documentType: "selfie",
        fileUrl: selfie.fileUrl,
        fileKey: selfie.fileKey,
        mimeType: selfie.mimeType,
      });

      setStoredKycStatus("submitted");
      setStep(successStep);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to submit verification";
      toast.error(message);
    }
  };

  const handleDocUpload = async (docLabel: string, file: File) => {
    try {
      setUploadingDoc(docLabel);
      const uploaded = await uploadToCloudinary(file, "document");
      setUploadedDocFiles((prev) => ({
        ...prev,
        [docLabel]: {
          fileUrl: uploaded.secureUrl,
          fileKey: uploaded.publicId,
          mimeType: file.type || "application/octet-stream",
        },
      }));
      setUploadedDocs(prev => ({ ...prev, [docLabel]: true }));
      toast.success(`${docLabel} uploaded`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to upload document";
      toast.error(message);
    } finally {
      setUploadingDoc(null);
      setActiveDocLabel(null);
      if (docInputRef.current) {
        docInputRef.current.value = "";
      }
    }
  };

  const docs = role === "agent" ? agentDocs : landlordDocs;
  const uploadedCount = docs.filter(d => uploadedDocs[d.label]).length;

  if (isLoading || (session?.token && !me)) {
    return <FullscreenLoader status="Loading onboarding" />;
  }

  if (step === 3 && role === "agent") {
    return (
      <div className="min-h-screen bg-[#f0ebe3]">
        <FacialVerification
          userRole="agent"
          onSuccess={(photoUrl) => {
            setVerificationPhotoUrl(photoUrl);
            setFacialVerificationComplete(true);
            setTimeout(() => setStep(4), 1500);
          }}
          onCancel={() => setStep(2)}
        />
      </div>
    );
  }

  if (step === 3 && role === "seeker") {
    return (
      <div className="min-h-screen bg-[#f0ebe3]">
        <FacialVerification
          userRole="seeker"
          onSuccess={(photoUrl) => {
            setVerificationPhotoUrl(photoUrl);
            const session = window.localStorage.getItem("verinest_session");
            if (session) {
              const parsed = JSON.parse(session);
              setStoredSession({
                ...parsed,
                user: {
                  ...parsed.user,
                  profilePhoto: photoUrl,
                  verificationStatus: "verified",
                }
              });
            }
            setFacialVerificationComplete(true);
            setTimeout(() => setStep(4), 1500);
          }}
          onCancel={() => setStep(2)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      {/* Minimal top bar */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M3 12 L12 4 L21 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="9" y="14" width="6" height="8" rx="1" fill="white"/>
            </svg>
          </div>
          <span className="text-sm sm:text-base font-semibold text-foreground">Verinest</span>
        </div>
        {step > 1 && (
          <button onClick={() => setStep(s => s - 1)} className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1">
            ← Back
          </button>
        )}
      </div>

      {/* Step indicator - minimal dots */}
      <div className="flex justify-center gap-1 sm:gap-1.5 px-4 py-3 sm:pb-4">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map(s => (
          <div key={s} className={`h-1 rounded-full transition-all duration-500 ${
            s === step ? "w-6 sm:w-8 bg-amber-600" : s < step ? "w-3 sm:w-4 bg-amber-600/40" : "w-3 sm:w-4 bg-border"
          }`} />
        ))}
      </div>

      {/* Main content - fully centered and responsive */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-4 sm:py-8 w-full">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
          {/* Step 1: Role */}
          {step === 1 && (
            <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <p className="text-xs font-medium text-primary tracking-widest uppercase">Step 1 of {totalSteps}</p>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">What brings you here?</h1>
                <p className="text-muted-foreground text-sm">Pick the one that best describes you.</p>
              </div>

              <div className="space-y-3">
              {roleCards.map((r) => {
                const selected = role === r.value;
                return (
                  <button
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    className={`w-full group flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                      selected
                        ? "border-primary bg-primary/[0.04] shadow-[0_0_0_4px_hsl(var(--primary)/0.08)]"
                        : "border-transparent bg-muted/40 hover:bg-muted/70"
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${selected ? "bg-primary/10" : "bg-muted"}`}>
                      <r.icon className={`h-5 w-5 ${selected ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-[15px] font-semibold ${selected ? "text-foreground" : "text-foreground/80"}`}>{r.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{r.desc}</p>
                    </div>
                    <div className={`h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                      selected ? "border-primary bg-primary" : "border-border"
                    }`}>
                      {selected && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <Button
              onClick={handleRoleContinue}
              disabled={!role}
              className="w-full h-12 rounded-xl text-sm font-semibold gap-2"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 2: Profile */}
        {step === 2 && (
          <div className="w-full max-w-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <p className="text-xs font-medium text-primary tracking-widest uppercase">Step 2 of {totalSteps}</p>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                {role === "seeker" ? "Let's find your match" : "A few quick details"}
              </h1>
              <p className="text-muted-foreground text-sm">This helps us tailor your experience — takes 30 seconds.</p>
            </div>

            {/* ── Contact & Location ── */}
            <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-4">
              <div className="flex items-center gap-2 pb-1">
                <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                </div>
                <h2 className="text-sm font-semibold text-foreground">Contact & Location</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Phone number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    <Input
                      placeholder="+234 801 234 5678"
                      className="pl-10 h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary/30 text-sm"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">
                    {role === "seeker" ? "Preferred city" : "Primary location"}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    <Input
                      placeholder="e.g. Lagos, Abuja"
                      className="pl-10 h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary/30 text-sm"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                </div>
                {role === "agent" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Operating state</label>
                    <select
                      className="h-11 w-full rounded-xl border border-transparent bg-muted/30 px-3 text-sm text-foreground focus:border-primary/30 focus:bg-background"
                      value={operatingState}
                      onChange={(e) => setOperatingState(e.target.value)}
                    >
                      <option value="">Select state</option>
                      {nigerianStates.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* ── Tenant: Preferences ── */}
            {role === "seeker" && (
              <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-5">
                <div className="flex items-center gap-2 pb-1">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Search className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <h2 className="text-sm font-semibold text-foreground">Search Preferences</h2>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Type of accommodation</label>
                  <div className="flex flex-wrap gap-2">
                    {["Rent", "Short-let", "Shared", "Serviced", "Not sure"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedType(opt)}
                        className={`px-4 h-9 rounded-full text-xs font-medium border transition-all ${
                          selectedType === opt
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Monthly budget range</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {["Under ₦200k", "₦200k–₦500k", "₦500k–₦1M", "₦1M+"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedBudget(opt)}
                        className={`h-11 rounded-xl text-xs font-medium border transition-all ${
                          selectedBudget === opt
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Move-in timeline</label>
                  <div className="flex flex-wrap gap-2">
                    {["Immediately", "Within 1 month", "1–3 months", "Just browsing"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedTimeline(opt)}
                        className={`px-4 h-9 rounded-full text-xs font-medium border transition-all ${
                          selectedTimeline === opt
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Agent: Professional Info ── */}
            {role === "agent" && (
              <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-5">
                <div className="flex items-center gap-2 pb-1">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <h2 className="text-sm font-semibold text-foreground">Professional Details</h2>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Agency / Company name <span className="text-muted-foreground/60">(optional)</span></label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    <Input
                      placeholder="e.g. Prime Realtors Ltd"
                      className="pl-10 h-11 rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary/30 text-sm"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Years of experience</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["< 1 year", "1–3 years", "3–5 years", "5+ years"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setExperience(opt)}
                        className={`h-11 rounded-xl text-xs font-medium border transition-all ${
                          experience === opt
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Specialization <span className="text-muted-foreground/60">(select multiple)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {["Residential", "Commercial", "Short-let", "Land", "Luxury"].map((opt) => {
                      const isSelected = selectedPropertyTypes.includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => setSelectedPropertyTypes(prev =>
                            isSelected ? prev.filter(p => p !== opt) : [...prev, opt]
                          )}
                          className={`px-4 h-9 rounded-full text-xs font-medium border transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary shadow-sm"
                              : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Short bio <span className="text-muted-foreground/60">(optional)</span></label>
                  <Textarea
                    placeholder="Tell potential clients about yourself and your services..."
                    className="min-h-[80px] rounded-xl bg-muted/30 border-transparent focus:bg-background focus:border-primary/30 text-sm resize-none"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* ── Landlord: Property Info ── */}
            {role === "landlord" && (
              <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-5">
                <div className="flex items-center gap-2 pb-1">
                  <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <h2 className="text-sm font-semibold text-foreground">Property Details</h2>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">How many properties do you have?</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["1", "2–5", "6–10", "10+"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedPropertyCount(opt)}
                        className={`h-11 rounded-xl text-sm font-medium border transition-all ${
                          selectedPropertyCount === opt
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Property types <span className="text-muted-foreground/60">(select multiple)</span></label>
                  <div className="flex flex-wrap gap-2">
                    {["Flat / Apartment", "Detached House", "Semi-detached", "Duplex", "Mini-flat", "Self-contain", "Commercial"].map((opt) => {
                      const isSelected = selectedPropertyTypes.includes(opt);
                      return (
                        <button
                          key={opt}
                          onClick={() => setSelectedPropertyTypes(prev =>
                            isSelected ? prev.filter(p => p !== opt) : [...prev, opt]
                          )}
                          className={`px-4 h-9 rounded-full text-xs font-medium border transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary shadow-sm"
                              : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Do you currently have an agent?</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Yes", "No", "Looking for one"].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => setSelectedAgentStatus(opt)}
                        className={`h-11 rounded-xl text-xs font-medium border transition-all ${
                          selectedAgentStatus === opt
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 pb-4">
              <Button onClick={handleProfileContinue} className="w-full h-12 rounded-xl text-sm font-semibold gap-2">
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
              <button onClick={handleComplete} className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1">
                Skip for now
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Document Upload KYC (landlords only) */}
        {step === 3 && role === "landlord" && (
          <div className="w-full max-w-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-2">
              <p className="text-xs font-medium text-primary tracking-widest uppercase">Step 3 of {totalSteps}</p>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">Verify your identity</h1>
              <p className="text-muted-foreground text-sm">Build trust with tenants and unlock premium features.</p>
            </div>

            {/* Benefits card */}
            <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/30 p-4 flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Why verify?</p>
                <ul className="mt-1.5 space-y-1">
                  <li className="text-xs text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" /> Verified badge on your profile
                  </li>
                  <li className="text-xs text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" /> 3× more leads from tenants
                  </li>
                  <li className="text-xs text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" /> Higher ranking in search results
                  </li>
                </ul>
              </div>
            </div>

            {/* Document upload cards */}
            <div className="space-y-3">
              {docs.map((doc) => {
                const isUploaded = uploadedDocs[doc.label];
                return (
                  <div key={doc.label} className={`rounded-2xl border-2 border-dashed p-5 transition-all ${
                    isUploaded ? "border-emerald-300 bg-emerald-50/30" : "border-border/60 bg-card hover:border-primary/30"
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isUploaded ? "bg-emerald-100" : "bg-muted/50"
                      }`}>
                        {isUploaded ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        ) : (
                          <doc.icon className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{doc.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{doc.desc}</p>
                        {!isUploaded ? (
                          <button
                            onClick={() => {
                              setActiveDocLabel(doc.label);
                              docInputRef.current?.click();
                            }}
                            disabled={uploadingDoc === doc.label}
                            className="mt-3 flex items-center gap-2 px-4 h-9 rounded-xl border border-border/60 bg-muted/30 text-xs font-medium text-muted-foreground hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-all disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {uploadingDoc === doc.label ? <OrbitLoader size="sm" /> : <Upload className="h-3.5 w-3.5" />}
                            {uploadingDoc === doc.label ? "Uploading..." : "Choose file"}
                          </button>
                        ) : (
                          <p className="mt-2 text-xs text-emerald-600 font-medium flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Document uploaded
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <input
              ref={docInputRef}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file && activeDocLabel) {
                  void handleDocUpload(activeDocLabel, file);
                }
              }}
            />

            {/* Progress */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${(uploadedCount / docs.length) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{uploadedCount} of {docs.length} uploaded</span>
            </div>

            <div className="space-y-3 pb-4">
              <Button
                onClick={handleSubmitKyc}
                disabled={uploadedCount === 0}
                className="w-full h-12 rounded-xl text-sm font-semibold gap-2"
              >
                Submit for Verification <ArrowRight className="h-4 w-4" />
              </Button>
              <button onClick={handleSkipKyc} className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors py-1">
                Skip for now — you can verify later in settings
              </button>
              <p className="text-center text-[10px] text-muted-foreground/70">
                Verified profiles get 3× more leads and priority placement
              </p>
            </div>
          </div>
        )}

        {/* Success step */}
        {step === successStep && (
          <div className="w-full max-w-md text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-primary/10 rounded-3xl rotate-6" />
              <div className="absolute inset-0 bg-primary/5 rounded-3xl -rotate-3" />
              <div className="relative h-full w-full bg-background rounded-3xl border border-border/60 flex items-center justify-center shadow-sm">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">You're in!</h1>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
                {role === "seeker"
                  ? "Start exploring properties or post what you need — verified agents will come to you."
                  : role === "agent"
                    ? "Your profile is now verified with facial recognition. Start listing properties and connecting with verified tenants."
                    : "Your dashboard is ready. List your first property and start connecting with tenants."}
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/40 text-left max-w-sm mx-auto">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Protected by escrow</p>
                <p className="text-[11px] text-muted-foreground">Every transaction is secured. Your money is safe.</p>
              </div>
            </div>

            <Button onClick={handleComplete} className="h-12 px-10 rounded-xl text-sm font-semibold gap-2">
              Go to dashboard <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Tenant step 3 (success) — handled by successStep above */}
        </div>
      </div>
    </div>
  );
}
