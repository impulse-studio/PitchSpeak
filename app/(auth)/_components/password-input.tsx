import { RiEyeLine, RiEyeOffLine, RiLock2Line } from "@remixicon/react";
import React from "react";

import * as Input from "@/components/ui/input";

export function PasswordInput(
  props: React.ComponentPropsWithoutRef<typeof Input.Input>
) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Input.Root hasError={props.hasError}>
      <Input.Wrapper>
        <Input.Icon as={RiLock2Line} />
        <Input.Input
          placeholder="••••••••••"
          type={showPassword ? "text" : "password"}
          {...props}
        />
        <button onClick={() => setShowPassword((s) => !s)} type="button">
          {showPassword ? (
            <RiEyeOffLine className="size-5 text-text-soft-400 group-has-[disabled]:text-text-disabled-300" />
          ) : (
            <RiEyeLine className="size-5 text-text-soft-400 group-has-[disabled]:text-text-disabled-300" />
          )}
        </button>
      </Input.Wrapper>
    </Input.Root>
  );
}
