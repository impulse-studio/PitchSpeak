"use client";

import { RiEqualizer3Fill, RiMoonLine, RiSunLine } from "@remixicon/react";
import { useTheme } from "next-themes";

import * as SegmentedControl from "@/components/ui/segmented-control";

export default function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <SegmentedControl.Root
      defaultValue={theme}
      onValueChange={setTheme}
      value={theme}
    >
      <SegmentedControl.List>
        <SegmentedControl.Trigger className="aspect-square" value="light">
          <RiSunLine className="size-4" />
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger className="aspect-square" value="dark">
          <RiMoonLine className="size-4" />
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger className="aspect-square" value="system">
          <RiEqualizer3Fill className="size-4" />
        </SegmentedControl.Trigger>
      </SegmentedControl.List>
    </SegmentedControl.Root>
  );
}
