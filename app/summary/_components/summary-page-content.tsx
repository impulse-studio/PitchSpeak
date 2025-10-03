"use client";

import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { Download, Home, Loader2, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ConversationHistorySidebar from "@/components/summary/ConversationHistorySidebar";
import * as Button from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface ConversationSummary {
  projectSummary: string;
  estimation: {
    timeframe?: string;
    complexity?: string;
    cost?: string;
    features: string[];
  };
  fullSummary: string;
}

export function SummaryPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlConversationId = searchParams.get(
    "id"
  ) as Id<"conversationSummaries"> | null;

  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [selectedConversationId, setSelectedConversationId] =
    useState<Id<"conversationSummaries"> | null>(urlConversationId);
  const [displaySummary, setDisplaySummary] =
    useState<ConversationSummary | null>(null);

  const selectedConversation = useQuery(
    api.conversationQueries.getConversationById,
    selectedConversationId ? { conversationId: selectedConversationId } : "skip"
  );

  useEffect(() => {
    if (urlConversationId) {
      setSelectedConversationId(urlConversationId);
    }
  }, [urlConversationId]);

  useEffect(() => {
    if (selectedConversation) {
      setDisplaySummary({
        projectSummary: selectedConversation.projectSummary,
        estimation: selectedConversation.estimation,
        fullSummary: selectedConversation.fullSummary,
      });
    }
  }, [selectedConversation]);

  const handleDownloadPDF = async () => {
    if (!displaySummary) return;

    setIsDownloading(true);
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(displaySummary),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `project-estimation-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!displaySummary || !email) return;

    setIsSendingEmail(true);
    try {
      const response = await fetch("/api/send-pdf-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, summary: displaySummary }),
      });

      if (!response.ok) throw new Error("Failed to send email");

      setEmailSent(true);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <>
      <Unauthenticated>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Access Restricted
            </h1>
            <p className="text-white/60 text-lg mb-8">
              Please sign in to view your conversation summaries
            </p>
            <Button.Root
              onClick={() => router.push("/sign-in")}
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition-all"
            >
              Sign In
            </Button.Root>
          </div>
        </div>
      </Unauthenticated>

      <Authenticated>
        <div className="min-h-screen bg-black text-white flex flex-col">
          <div className="flex flex-1">
            <ConversationHistorySidebar
              onSelectConversation={setSelectedConversationId}
              selectedConversationId={selectedConversationId}
            />

            <main className="flex-1 overflow-y-auto px-4 py-24 relative">
              <div className="absolute top-4 left-4">
                <Button.Root
                  onClick={() => router.push("/")}
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold transition-all border border-white/20 flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Home
                </Button.Root>
              </div>

              {!displaySummary ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    Your Estimations
                  </h1>
                  <p className="text-white/60 text-lg">
                    Select a conversation from the history to view details
                  </p>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                    Project Summary
                  </h1>

                  {/* Project Summary */}
                  <section className="mb-8 p-6 rounded-lg bg-white/5 border border-white/10">
                    <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                      Overview
                    </h2>
                    <p className="text-white/80 leading-relaxed">
                      {displaySummary.projectSummary}
                    </p>
                  </section>

                  {/* Estimation Details */}
                  <section className="mb-8 p-6 rounded-lg bg-white/5 border border-white/10">
                    <h2 className="text-2xl font-semibold mb-4 text-pink-400">
                      Estimation
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {displaySummary.estimation.complexity && (
                        <div>
                          <p className="text-white/60 text-sm mb-1">
                            Complexity
                          </p>
                          <p className="text-xl font-semibold text-white">
                            {displaySummary.estimation.complexity}
                          </p>
                        </div>
                      )}
                      {displaySummary.estimation.timeframe && (
                        <div>
                          <p className="text-white/60 text-sm mb-1">
                            Estimated Duration
                          </p>
                          <p className="text-xl font-semibold text-white">
                            {displaySummary.estimation.timeframe}
                          </p>
                        </div>
                      )}
                      {displaySummary.estimation.cost && (
                        <div className="md:col-span-2">
                          <p className="text-white/60 text-sm mb-1">
                            Estimated Cost
                          </p>
                          <p className="text-xl font-semibold text-white">
                            {displaySummary.estimation.cost}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-white/60 text-sm mb-3">Key Features</p>
                      <ul className="space-y-2">
                        {displaySummary.estimation.features.map(
                          (feature, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-400 mr-2">✓</span>
                              <span className="text-white/80">{feature}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </section>

                  {/* Full Summary */}
                  <section className="mb-8 p-6 rounded-lg bg-white/5 border border-white/10">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                      Detailed Summary
                    </h2>
                    <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                      {displaySummary.fullSummary}
                    </p>
                  </section>

                  {/* Actions */}
                  <section className="p-6 rounded-lg bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-white/20">
                    <h2 className="text-2xl font-semibold mb-6">
                      Get Your Estimation
                    </h2>

                    <div className="mb-6">
                      <Button.Root
                        onClick={handleDownloadPDF}
                        disabled={isDownloading}
                        color="primary"
                        className="w-full md:w-auto text-white px-8 py-3 rounded-lg font-semibold transition-all"
                      >
                        {isDownloading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generating PDF...
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5 mr-2" />
                            Download PDF
                          </>
                        )}
                      </Button.Root>
                    </div>

                    <div className="border-t border-white/10 pt-6">
                      <p className="text-white/80 mb-4">
                        Or receive it by email:
                      </p>

                      {emailSent ? (
                        <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400">
                          ✓ Email sent successfully!
                        </div>
                      ) : (
                        <div className="flex flex-col md:flex-row gap-3">
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <Button.Root
                            onClick={handleSendEmail}
                            disabled={!email || isSendingEmail}
                            color="primary"
                            className="text-white px-4 py-3 rounded-lg h-12 font-semibold transition-all disabled:cursor-not-allowed"
                          >
                            {isSendingEmail ? (
                              <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Mail className="w-5 h-5 mr-2" />
                                Send
                              </>
                            )}
                          </Button.Root>
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              )}
            </main>
          </div>
        </div>
      </Authenticated>
    </>
  );
}
