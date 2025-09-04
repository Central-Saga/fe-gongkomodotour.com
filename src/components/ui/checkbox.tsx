import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        className={cn(
          "size-4 appearance-none rounded border border-input bg-background",
          "checked:bg-primary checked:text-primary-foreground checked:border-primary",
          "outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "grid place-items-center",
          className
        )}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";

