import { createTV } from "tailwind-variants";

import { twMergeConfig } from "@/lib/utils/cn";

export type {
  ClassValue as TVClassValue,
  VariantProps,
} from "tailwind-variants";

export const tv = createTV({
  twMergeConfig,
});
