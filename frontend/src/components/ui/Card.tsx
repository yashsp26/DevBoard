import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../../utils/cn";

export function Card({
  className,
  ...props
}: ComponentPropsWithoutRef<"section">) {
  return (
    <section
      className={cn(
        "neu-raised rounded-2xl border border-border/70 bg-elevated",
        className,
      )}
      {...props}
    />
  );
}
