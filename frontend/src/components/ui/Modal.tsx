import { X } from "lucide-react";
import { motion } from "motion/react";
import { type ReactNode, useEffect, useId, useRef } from "react";

type ModalProps = {
  children: ReactNode;
  contentClassName?: string;
  footer?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

export function Modal({
  children,
  contentClassName = "",
  footer,
  isOpen,
  onClose,
  title,
}: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const activeElement = document.activeElement as HTMLElement | null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements =
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );

      if (!focusableElements?.length) {
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      activeElement?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <motion.div
      animate={{ opacity: 1 }}
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      transition={{ duration: 0.16 }}
    >
      <motion.div
        ref={dialogRef}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`flex max-h-[calc(100vh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border-subtle bg-elevated shadow-2xl ${contentClassName}`}
        exit={{ opacity: 0, scale: 0.98, y: 8 }}
        initial={{ opacity: 0, scale: 0.98, y: 8 }}
        tabIndex={-1}
        transition={{ duration: 0.16 }}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border-subtle px-6 py-4">
          <h2 className="text-lg font-semibold text-text" id={titleId}>
            {title}
          </h2>

          <button
            aria-label="Close dialog"
            className="rounded-md p-2 text-muted transition hover:bg-app hover:text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
            onClick={onClose}
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {footer && (
          <div className="flex shrink-0 justify-end gap-3 border-t border-border-subtle px-6 py-4">
            {footer}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
