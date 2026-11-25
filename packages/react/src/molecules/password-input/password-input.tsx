import { forwardRef, useState } from "react";
import { IconButton } from "../../atoms/button";
import { Input } from "../../atoms/input";
import type { InputProps } from "../../atoms/input";
import { IconEye, IconEyeOff } from "../../icons";
import { useMessages } from "../../provider";
import { InputGroup } from "../input-group";

export type PasswordInputProps = Omit<InputProps, "type">;

/** Password input with a show/hide toggle. Paste and password managers keep working (WCAG 3.3.8). */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput({ size = "md", autoComplete = "current-password", ...props }, ref) {
    const messages = useMessages();
    const [visible, setVisible] = useState(false);
    return (
      <InputGroup
        size={size}
        end={
          <IconButton
            label={visible ? messages.hidePassword : messages.showPassword}
            aria-pressed={visible}
            size="xs"
            onClick={() => setVisible((previous) => !previous)}
          >
            {visible ? <IconEyeOff /> : <IconEye />}
          </IconButton>
        }
      >
        <Input
          {...props}
          ref={ref}
          size={size}
          autoComplete={autoComplete}
          type={visible ? "text" : "password"}
        />
      </InputGroup>
    );
  },
);
