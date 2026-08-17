import { Code2, LockKeyhole, Search } from "lucide-react";
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
    <main className="auth-page-shell relative isolate min-h-screen overflow-hidden bg-background lg:grid lg:grid-cols-2">
      <section className="relative hidden overflow-hidden p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="relative z-10 flex items-center gap-2 text-lg font-semibold tracking-tight text-text">
          <Code2 aria-hidden="true" className="size-5 text-primary" />
          DevLupo
        </div>
        <div className="auth-illustration absolute inset-x-8 top-1/2 -translate-y-1/2">
          <svg aria-label="Animated developer console illustration" className="mx-auto w-full max-w-xl" role="img" viewBox="0 0 560 420">
            <g className="auth-core">
              <rect className="auth-console" height="180" rx="24" width="240" x="160" y="120" />
              <rect className="auth-track" height="10" rx="5" width="192" x="184" y="145" /><rect fill="#ef5b4e" height="10" opacity=".9" rx="5" width="112" x="184" y="145" /><circle className="auth-console-sm" cx="296" cy="150" r="9" />
              <rect className="auth-track" height="10" rx="5" width="192" x="184" y="179" /><rect fill="#4a90d9" height="10" opacity=".9" rx="5" width="74" x="184" y="179" /><circle className="auth-console-sm" cx="258" cy="184" r="9" />
              <rect className="auth-track" height="26" rx="13" width="192" x="184" y="207" /><Search className="text-muted" size="16" x="198" y="212" /><rect fill="currentColor" height="6" opacity=".45" rx="3" width="70" x="222" y="217" />
              <circle cx="332" cy="220" fill="#ef5b4e" r="2.4" /><circle cx="340" cy="220" fill="#f2a93b" r="2.4" /><circle cx="348" cy="220" fill="#3fcb7c" r="2.4" /><circle cx="356" cy="220" fill="#4a90d9" r="2.4" />
              <text fill="currentColor" fontFamily="monospace" fontSize="24" letterSpacing="4" opacity=".45" x="188" y="280">{'{ }'}</text>
            </g>
            <g className="auth-badge-left"><circle className="auth-console-sm" cx="144" cy="120" r="29" /><LockKeyhole color="#4a90d9" fill="#4a90d9" size="26" strokeWidth="2" x="131" y="107" /><circle cx="144" cy="75" fill="#ef5b4e" r="2.2" /><circle cx="178" cy="96" fill="#f2a93b" r="2.2" /><circle cx="178" cy="136" fill="#3fcb7c" r="2.2" /><circle cx="144" cy="157" fill="#4a90d9" r="2.2" /></g>
            <g className="auth-badge-right"><rect fill="#3fcb7c" height="28" opacity=".85" rx="14" width="60" x="384" y="260" /><circle className="auth-console-sm" cx="430" cy="274" r="11" /></g>
            <g className="auth-spinner" transform="translate(415 115)"><path d="M8 0h5M2 8l2 5M-6 5l-4 3M-6-5l-4-3M2-8l2-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" /></g>
            <circle className="auth-particle" cx="176" cy="76" fill="#4a90d9" r="3.5" /><circle className="auth-particle auth-particle-delay" cx="338" cy="76" fill="#e38fa0" r="2.5" /><circle className="auth-particle auth-particle-delay" cx="130" cy="260" fill="#3fcb7c" r="2" /><circle className="auth-particle" cx="358" cy="330" fill="#ef5b4e" r="2.5" />
          </svg>
        </div>
        <p className="relative z-10 text-sm text-muted">
          Built for the flow state.
        </p>
      </section>
      <section className="relative z-10 grid min-h-screen place-items-center px-6 py-12 sm:px-10">
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
