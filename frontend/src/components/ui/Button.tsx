import { motion, type HTMLMotionProps } from "motion/react";
import { type ReactNode } from "react";
import { cn } from "../../utils/cn";
import { Spinner } from "./Spinner";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = HTMLMotionProps<"button"> & {
  children?: ReactNode;
  isLoading?: boolean;
  size?: "default" | "icon";
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-accent-foreground shadow-[var(--shadow-elevation-2)] hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[var(--shadow-elevation-3)] active:translate-y-0 active:bg-[var(--accent-orange-active)] active:shadow-[var(--shadow-inset)]",
  secondary: "neu-raised bg-elevated text-text hover:-translate-y-0.5 hover:bg-hover hover:shadow-[var(--shadow-elevation-3)] active:translate-y-0 active:shadow-[var(--shadow-inset)]",
  ghost: "neu-raised-sm bg-elevated text-muted hover:-translate-y-0.5 hover:bg-primary/10 hover:text-text active:translate-y-0 active:bg-primary/15 active:shadow-[var(--shadow-inset)]",
  danger:
    "bg-danger text-white shadow-[var(--shadow-elevation-2)] hover:-translate-y-0.5 hover:bg-danger/90 hover:shadow-[var(--shadow-elevation-3)] active:translate-y-0 active:shadow-[var(--shadow-inset)]",
};

export function Button({
  children,
  className,
  disabled,
  isLoading = false,
  size = "default",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <motion.button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition-[background-color,color,box-shadow,transform] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-45",
        size === "icon" ? "h-9 w-9 shrink-0 p-0" : "min-h-10 px-4",
        variantClasses[variant],
        className,
      )}
      disabled={disabled || isLoading}
      transition={{ duration: 0.12 }}
      type={type}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {isLoading && <Spinner className="size-4" label="Loading" />}
      {children}
    </motion.button>
  );
}
