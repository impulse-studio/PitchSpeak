import { useAction } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface RateLimitState {
  remaining: number | null;
  reset: number | null;
  isLoading: boolean;
}

export function useRateLimit(userId: string | undefined) {
  const [state, setState] = useState<RateLimitState>({
    remaining: null,
    reset: null,
    isLoading: false,
  });

  const getRemainingCalls = useAction(api.rateLimit.getRemainingCalls);

  useEffect(() => {
    if (!userId) return;

    const fetchRemainingCalls = async () => {
      setState((prev) => ({ ...prev, isLoading: true }));
      try {
        const result = await getRemainingCalls({ userId });
        setState({
          remaining: result.remaining,
          reset: result.reset,
          isLoading: false,
        });
      } catch (error) {
        console.error("Failed to fetch remaining calls:", error);
        toast.error("Failed to load rate limit information");
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchRemainingCalls();
  }, [userId, getRemainingCalls]);

  return state;
}
