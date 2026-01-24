/**
 * Mulligan Feedback Page
 *
 * When clients click "USE YOUR MULLIGAN" in their email,
 * they land here to provide feedback on what they want changed.
 *
 * @route /mulligan/[token]/page.tsx
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

// ============================================================================
// Types
// ============================================================================

interface ProductionInfo {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  mulliganAvailable: boolean;
  status: string;
}

interface FeedbackCategory {
  id: string;
  label: string;
  icon: string;
  examples: string[];
}

// ============================================================================
// Feedback Categories
// ============================================================================

const FEEDBACK_CATEGORIES: FeedbackCategory[] = [
  {
    id: "pacing",
    label: "Pacing & Energy",
    icon: "⚡",
    examples: ["Make it faster/slower", "More energetic", "Calmer tone"],
  },
  {
    id: "visuals",
    label: "Visual Style",
    icon: "🎨",
    examples: ["Different colors", "More modern look", "Different transitions"],
  },
  {
    id: "voice",
    label: "Voice & Audio",
    icon: "🎙️",
    examples: ["Different voice style", "Change music", "Adjust volume"],
  },
  {
    id: "message",
    label: "Message & Script",
    icon: "📝",
    examples: [
      "Emphasize different features",
      "Stronger CTA",
      "Different angle",
    ],
  },
  {
    id: "format",
    label: "Format & Length",
    icon: "📐",
    examples: [
      "Shorter version",
      "Different aspect ratio",
      "Add/remove sections",
    ],
  },
  {
    id: "other",
    label: "Other",
    icon: "💡",
    examples: ["Anything else you'd like changed"],
  },
];

// ============================================================================
// Main Component
// ============================================================================

export default function MulliganFeedbackPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [production, setProduction] = useState<ProductionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [feedbackText, setFeedbackText] = useState("");
  const [priorityLevel, setPriorityLevel] = useState<
    "subtle" | "moderate" | "significant"
  >("moderate");

  // ===== Load Production Info =====
  useEffect(() => {
    async function loadProduction() {
      try {
        const res = await fetch(`/api/mulligan/info?token=${token}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to load production");
        }
        const data = await res.json();
        setProduction(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load production"
        );
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      loadProduction();
    }
  }, [token]);

  // ===== Toggle Category Selection =====
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // ===== Submit Mulligan with Feedback =====
  const handleSubmit = async () => {
    if (!feedbackText.trim() && selectedCategories.length === 0) {
      setError(
        "Please provide some feedback or select what you'd like changed."
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/mulligan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          feedback: {
            categories: selectedCategories,
            details: feedbackText,
            priorityLevel,
            submittedAt: new Date().toISOString(),
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit mulligan");
      }

      setSuccess(true);

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push(
          `/dashboard/lab?production=${data.newProductionId}&mulligan=success`
        );
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // ===== Loading State =====
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#00CED1] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading your production...</p>
        </div>
      </div>
    );
  }

  // ===== Error State =====
  if (error && !production) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 rounded-2xl p-8 text-center border border-red-500/20">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-xl font-bold text-white mb-2">Unable to Load</h1>
          <p className="text-zinc-400 mb-6">{error}</p>
          <a
            href="/dashboard"
            className="inline-block px-6 py-3 bg-[#00CED1] text-black font-semibold rounded-lg"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  // ===== Success State =====
  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-zinc-900 rounded-2xl p-8 text-center border border-[#00CED1]/30"
        >
          <div className="text-6xl mb-4">🎬</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Mulligan Activated!
          </h1>
          <p className="text-zinc-400 mb-4">
            Your commercial is being recreated with your feedback.
          </p>
          <div className="bg-[#00CED1]/10 rounded-lg p-4 mb-6">
            <p className="text-[#00CED1] text-sm">
              Estimated completion: <strong>4-5 minutes</strong>
            </p>
          </div>
          <p className="text-zinc-500 text-sm">Redirecting to dashboard...</p>
        </motion.div>
      </div>
    );
  }

  // ===== Mulligan Already Used =====
  if (production && !production.mulliganAvailable) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900 rounded-2xl p-8 text-center border border-yellow-500/20">
          <div className="text-4xl mb-4">🎲</div>
          <h1 className="text-xl font-bold text-white mb-2">
            Mulligan Already Used
          </h1>
          <p className="text-zinc-400 mb-6">
            You&apos;ve already used your free recreation for this production.
            Additional recreations cost 1 token.
          </p>
          <a
            href={`/dashboard/lab?production=${production.id}`}
            className="inline-block px-6 py-3 bg-[#00CED1] text-black font-semibold rounded-lg"
          >
            View Production
          </a>
        </div>
      </div>
    );
  }

  // ===== Main Feedback Form =====
  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-full mb-4">
            <span className="text-[#FFD700]">🎲</span>
            <span className="text-[#FFD700] font-medium text-sm">
              FREE MULLIGAN
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Let&apos;s Make It Perfect
          </h1>
          <p className="text-zinc-400">
            Tell us what you&apos;d like changed and we&apos;ll recreate your
            commercial.
          </p>
        </div>

        {/* Production Preview */}
        {production && (
          <div className="bg-zinc-900 rounded-xl p-4 mb-8 border border-zinc-800">
            <div className="flex gap-4">
              {production.thumbnailUrl && (
                <img
                  src={production.thumbnailUrl}
                  alt="Video thumbnail"
                  className="w-32 h-20 object-cover rounded-lg"
                />
              )}
              <div>
                <h3 className="font-semibold text-white">{production.title}</h3>
                {production.videoUrl && (
                  <a
                    href={production.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00CED1] text-sm hover:underline"
                  >
                    Watch current version →
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Feedback Categories */}
        <div className="mb-8">
          <label className="block text-white font-medium mb-3">
            What would you like us to change?{" "}
            <span className="text-zinc-500">(select all that apply)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FEEDBACK_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  selectedCategories.includes(category.id)
                    ? "bg-[#00CED1]/10 border-[#00CED1] text-white"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <span className="text-2xl mb-2 block">{category.icon}</span>
                <span className="font-medium text-sm">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Change Intensity */}
        <div className="mb-8">
          <label className="block text-white font-medium mb-3">
            How different should the new version be?
          </label>
          <div className="flex gap-3">
            {[
              {
                value: "subtle",
                label: "Subtle tweaks",
                desc: "Small refinements",
              },
              {
                value: "moderate",
                label: "Moderate changes",
                desc: "Fresh take",
              },
              {
                value: "significant",
                label: "Significant overhaul",
                desc: "Completely different",
              },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  setPriorityLevel(option.value as typeof priorityLevel)
                }
                className={`flex-1 p-4 rounded-xl border text-center transition-all ${
                  priorityLevel === option.value
                    ? "bg-[#FFD700]/10 border-[#FFD700] text-white"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <span className="font-medium text-sm block">{option.label}</span>
                <span className="text-xs text-zinc-500">{option.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Feedback */}
        <div className="mb-8">
          <label className="block text-white font-medium mb-3">
            Tell us more <span className="text-zinc-500">(be specific!)</span>
          </label>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder={`Examples:
• Make the intro more attention-grabbing
• Use warmer colors that match our brand
• Speed up the middle section
• Emphasize our 24/7 support feature more
• Use a friendlier, more conversational tone`}
            className="w-full h-40 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#00CED1] resize-none"
          />
          <p className="text-zinc-500 text-xs mt-2">
            The more detail you provide, the better we can tailor your
            recreation.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-4 bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-black font-bold rounded-xl text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Creating your new version...
            </span>
          ) : (
            "🎬 Recreate My Commercial"
          )}
        </button>

        <p className="text-center text-zinc-500 text-sm mt-4">
          This is your one free mulligan. Make it count!
        </p>
      </div>
    </div>
  );
}
