"use client";

import { usePaginatedQuery, useQuery } from "convex/react";
import { ChevronRight, FileText, Loader2 } from "lucide-react";
import * as Button from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils/cn";

interface ConversationHistorySidebarProps {
  onSelectConversation?: (conversationId: Id<"conversationSummaries">) => void;
  selectedConversationId?: Id<"conversationSummaries"> | null;
}

export default function ConversationHistorySidebar({
  onSelectConversation,
  selectedConversationId,
}: ConversationHistorySidebarProps) {
  const currentUser = useQuery(api.auth.getCurrentUser);

  const { results, status, loadMore } = usePaginatedQuery(
    api.conversationQueries.getConversationHistory,
    currentUser?._id ? { userId: currentUser._id } : "skip",
    { initialNumItems: 10 }
  );

  if (status === "LoadingFirstPage" || currentUser === undefined) {
    return (
      <div className="w-80 bg-white/5 border-r border-white/10 p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-white/40" />
      </div>
    );
  }

  // If user is not authenticated (null), show appropriate message
  if (currentUser === null) {
    return (
      <div className="w-80 bg-white/5 border-r border-white/10 p-6">
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto mb-4 text-white/20" />
          <p className="text-white/40 text-sm">
            Please sign in to view history
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white/5 border-r border-white/10 flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-semibold text-white mb-2">History</h2>
        <p className="text-sm text-white/60">
          {results.length} conversation
          {results.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {results.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-white/20" />
            <p className="text-white/40 text-sm">No conversations</p>
          </div>
        ) : (
          <>
            {results.map((conversation) => (
              <Button.Root
                key={conversation._id}
                onClick={() => onSelectConversation?.(conversation._id)}
                className={cn(
                  "w-full h-auto text-left p-4 rounded-lg transition-all justify-start",
                  selectedConversationId === conversation._id
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                    : "bg-white/5 border border-white/10 hover:bg-white/10"
                )}
              >
                <div className="flex flex-col gap-2 w-full">
                  <h3 className="text-sm font-medium text-white line-clamp-2">
                    {conversation.projectSummary}
                  </h3>

                  <div className="text-xs text-white/40">
                    {new Date(conversation._creationTime).toLocaleDateString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </div>
                </div>
              </Button.Root>
            ))}

            {status === "CanLoadMore" && (
              <Button.Root
                onClick={() => loadMore(10)}
                className="w-full bg-white/5 hover:bg-white/10 text-white px-4 py-3 rounded-lg font-semibold transition-all border border-white/10 flex items-center justify-center gap-2"
              >
                <ChevronRight className="w-4 h-4" />
                Load More
              </Button.Root>
            )}

            {status === "LoadingMore" && (
              <div className="flex items-center justify-center py-3">
                <Loader2 className="w-5 h-5 animate-spin text-white/40" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
