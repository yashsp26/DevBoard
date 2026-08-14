import { Code2, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { type ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";

type AuthLayoutProps = {
  children: ReactNode;
  description: string;
  title: string;
};

export function AuthLayout({ children, description, title }: AuthLayoutProps) {
  return (
    <main className="auth-page-shell min-h-screen bg-background lg:grid lg:grid-cols-2">
      <section className="relative hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="relative z-10 flex items-center gap-2 text-lg font-semibold tracking-tight text-text">
          <Code2 aria-hidden="true" className="size-5 text-primary" />
          DevLupo
        </div>
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
          <div className="max-w-md space-y-5">
            <span className="mx-auto flex size-12 items-center justify-center rounded-xl border border-border-subtle bg-elevated text-primary">
              <Sparkles aria-hidden="true" className="size-5" />
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-text">
              A focused workspace for builders.
            </h1>
            <p className="text-base leading-7 text-secondary">
              Plan, ship, and keep your development work moving without the
              noise.
            </p>
          </div>
        </div>
        <p className="relative z-10 text-sm text-muted">
          Built for the flow state.
        </p>
      </section>
      <section className="relative grid min-h-screen place-items-center px-6 py-12 sm:px-10">
        <div className="absolute right-6 top-6 sm:right-10 sm:top-8">
          <ThemeToggle />
        </div>
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="auth-form-card w-full max-w-105 rounded-2xl p-6 sm:p-8"
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        >
          <div className="mb-8 space-y-2">
            <p className="text-sm font-medium text-primary">DevLupo</p>
            <h1 className="text-3xl font-semibold tracking-tight text-text">
              {title}
            </h1>
            <p className="text-sm leading-6 text-muted">{description}</p>
          </div>
          {children}
        </motion.div>
      </section>
    </main>
  );
}
