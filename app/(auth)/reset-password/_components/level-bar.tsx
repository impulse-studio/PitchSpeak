/* eslint-disable @typescript-eslint/no-unused-vars */

import { cn } from "@/lib/utils/cn";

const defaultLevelColors = {
  1: "text-error-base",
  2: "text-warning-base",
  3: "text-success-base",
};

function LevelBar({
  levels = 3,
  level = 1,
  levelColors = defaultLevelColors,
  className,
  ...rest
}: {
  level: number;
  levels?: number;
  levelColors?: { [key: number]: string };
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative flex gap-2 overflow-hidden rounded-full",
        levelColors[1],
        className,
        levelColors[level]
      )}
      {...rest}
    >
      {Array.from({ length: levels }, (_, i) => i).map((currentLevel) => (
        <LevelBarItem
          active={currentLevel < level}
          key={currentLevel}
          level={level}
          levels={levels}
        />
      ))}
    </div>
  );
}

function LevelBarItem({
  active,
  levels,
  level,
  ...rest
}: {
  active?: boolean;
  level: number;
  levels: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className="h-1 w-full rounded-full bg-bg-soft-200"
      style={{
        clipPath: "inset(0 round 99px)",
      }}
      {...rest}
    >
      <div
        className="absolute top-0 left-0 h-full w-0 rounded-full bg-current duration-500 ease-out"
        style={{
          transitionProperty: "width",
          width: `calc((100% / ${levels}) * ${level})`,
        }}
      />
    </div>
  );
}

export { LevelBar as Root };
