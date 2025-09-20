// biome-ignore lint/correctness/noUnusedImports: We need to import React to use it in the global.d.ts file
import * as React from "react";

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}