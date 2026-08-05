import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../../utils/cn";

export function Card({
  className,
  ...props
}: ComponentPropsWithoutRef<"section">) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border-subtle bg-elevated shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
