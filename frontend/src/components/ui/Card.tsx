import { type ComponentPropsWithoutRef } from "react";
import { cn } from "../../utils/cn";

export function Card({
  className,
  ...props
}: ComponentPropsWithoutRef<"section">) {
  return (
    <section
      className={cn(
        "neu-raised rounded-xl border-0 bg-elevated",
        className,
      )}
      {...props}
    />
  );
}
