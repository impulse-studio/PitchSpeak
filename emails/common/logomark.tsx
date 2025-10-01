import type React from "react";

// import { Logo } from "@/components/logo";
import { PROJECT } from "@/constants/project";
import { cn } from "@/lib/utils/cn";

interface LogomarkProps {
  className?: string;
  logoClassName?: string;
  textClassName?: string;
}

function Logomark({
  className,
  logoClassName,
  textClassName,
  ...props
}: LogomarkProps & Omit<React.ComponentProps<"div">, "className">) {
  return (
    <div className={cn("my-4 flex items-center gap-4", className)} {...props}>
      {/* <Logo className={cn("size-5 w-auto", logoClassName)} /> */}
      <span className={cn("font-medium text-lg tracking-tight", textClassName)}>
        {PROJECT.NAME}
      </span>
    </div>
  );
}

export { Logomark };
