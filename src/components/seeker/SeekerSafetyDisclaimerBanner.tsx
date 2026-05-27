import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

export function SeekerSafetyDisclaimerBanner() {
  const [acknowledged, setAcknowledged] = useState(() => {
    try {
      return localStorage.getItem("seeker_safety_disclaimer_acknowledged") === "true";
    } catch {
      return false;
    }
  });

  if (acknowledged) return null;

  const checkpoints = [
    {
      title: "Collect Keys Before Payment",
      description: "Always collect the apartment keys before making any payment. Never pay in advance for a property you have not physically accessed.",
    },
    {
      title: "Never Pay for Occupied Properties",
      description: "Do not accept to make payments for properties that are still occupied under the premise that they will soon be vacated.",
    },
    {
      title: "Read All Documentation",
      description: "Carefully read and understand the property deeds, agreements, occupancy notes, and all other documentation before signing or agreeing to anything.",
    },
    {
      title: "Ask Clarifying Questions",
      description: "Always ask questions to be clear about any terms, conditions, or concerns. There are no silly questions when protecting your investment.",
    },
  ];

  const handleAcknowledge = () => {
    try {
      localStorage.setItem("seeker_safety_disclaimer_acknowledged", "true");
      setAcknowledged(true);
    } catch {
      setAcknowledged(true);
    }
  };

  return (
    <Alert className="mb-6 border-amber-200/80 bg-amber-50 text-amber-900">
      <AlertCircle className="h-5 w-5 text-amber-600" />
      <AlertTitle className="ml-2 text-base font-semibold text-amber-900">Important Safety Guidelines</AlertTitle>
      <AlertDescription className="ml-7 mt-4 space-y-4">
        <p className="text-sm leading-relaxed">
          While payments for properties cannot yet be made on the VeriNest platform, please ensure you follow these critical guidelines when dealing with properties:
        </p>

        <div className="space-y-3">
          {checkpoints.map((checkpoint, index) => (
            <div key={index} className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">{checkpoint.title}</p>
                <p className="text-xs mt-1 text-amber-800">{checkpoint.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-amber-200/60">
          <button
            onClick={handleAcknowledge}
            className="inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 transition-colors"
          >
            I Understand & Accept
          </button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
