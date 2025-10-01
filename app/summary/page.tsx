"use client";

import { Suspense } from "react";
import { SummaryPageContent } from "./_components/summary-page-content";

export default function SummaryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex flex-col">
          <div className="flex flex-1">
            <div className="flex-1 overflow-y-auto px-4 py-24 relative">
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <div className="animate-pulse">
                  <div className="h-8 bg-white/10 rounded-lg w-64 mb-4" />
                  <div className="h-4 bg-white/10 rounded w-96" />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <SummaryPageContent />
    </Suspense>
  );
}
