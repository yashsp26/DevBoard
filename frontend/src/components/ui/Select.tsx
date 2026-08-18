import { Check, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "../../utils/cn";

export type SelectOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

type SelectProps = {
  "aria-label"?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  multiple?: boolean;
  name?: string;
  onBlur?: () => void;
  onValueChange: (value: string | string[]) => void;
  options: SelectOption[];
  placeholder?: string;
  size?: "default" | "sm";
  value: string | string[];
};

const isSelected = (value: string | string[], optionValue: string) =>
  Array.isArray(value) ? value.includes(optionValue) : value === optionValue;

export function Select({
  "aria-label": ariaLabel,
  className,
  disabled = false,
  id,
  multiple = false,
  name,
  onBlur,
  onValueChange,
  options,
  placeholder = "Select an option",
  size = "default",
  value,
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const listboxId = `${selectId}-listbox`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const selectedIndex = options.findIndex((option) => isSelected(value, option.value));
  const [highlightedIndex, setHighlightedIndex] = useState(Math.max(selectedIndex, 0));
  const selectedOptions = useMemo(
    () => options.filter((option) => isSelected(value, option.value)),
    [options, value],
  );
  const displayValue = selectedOptions.length
    ? selectedOptions.map((option) => option.label).join(", ")
    : placeholder;

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isOpen]);

  useEffect(() => {
    if (selectedIndex >= 0) setHighlightedIndex(selectedIndex);
  }, [selectedIndex]);

  const moveHighlight = (direction: 1 | -1) => {
    if (!options.length) return;
    let next = highlightedIndex;
    for (let attempt = 0; attempt < options.length; attempt += 1) {
      next = (next + direction + options.length) % options.length;
      if (!options[next].disabled) {
        setHighlightedIndex(next);
        return;
      }
    }
  };

  const choose = (option: SelectOption) => {
    if (option.disabled) return;
    if (multiple) {
      const current = Array.isArray(value) ? value : [];
      onValueChange(
        current.includes(option.value)
          ? current.filter((item) => item !== option.value)
          : [...current, option.value],
      );
      return;
    }
    onValueChange(option.value);
    setIsOpen(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) setIsOpen(true);
      moveHighlight(event.key === "ArrowDown" ? 1 : -1);
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const index = event.key === "Home" ? 0 : options.length - 1;
      setHighlightedIndex(index);
      if (!isOpen) setIsOpen(true);
      return;
    }
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else if (options[highlightedIndex]) {
        choose(options[highlightedIndex]);
      }
    }
  };

  return (
    <div className="relative min-w-0" ref={containerRef}>
      {name && <input name={name} type="hidden" value={Array.isArray(value) ? value.join(",") : value} />}
      <button
        aria-activedescendant={isOpen ? `${listboxId}-${highlightedIndex}` : undefined}
        aria-controls={listboxId}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={cn(
          "neu-raised flex w-full items-center justify-between gap-3 rounded-xl bg-elevated px-3 text-left text-sm text-text transition-[box-shadow,transform] hover:-translate-y-px hover:shadow-[var(--shadow-elevation-3)] focus-visible:outline-none focus-visible:shadow-[var(--focus-ring),var(--shadow-elevation-2)] disabled:pointer-events-none disabled:opacity-45",
          size === "sm" ? "min-h-9 py-1.5 text-xs" : "min-h-10 py-2",
          className,
        )}
        disabled={disabled}
        id={selectId}
        onBlur={onBlur}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={onKeyDown}
        type="button"
      >
        <span className={cn("truncate", !selectedOptions.length && "text-muted")}>{displayValue}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn("size-4 shrink-0 text-muted transition-transform duration-150", isOpen && "rotate-180 text-primary")}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="neu-raised-lg absolute z-50 mt-2 max-h-64 w-full min-w-44 overflow-y-auto rounded-2xl bg-elevated p-1.5"
            exit={{ opacity: 0, scale: 0.98, y: -4 }}
            id={listboxId}
            initial={{ opacity: 0, scale: 0.98, y: -4 }}
            role="listbox"
            aria-label={ariaLabel}
            aria-multiselectable={multiple || undefined}
            transition={{ duration: 0.14, ease: "easeOut" }}
          >
            {options.map((option, index) => {
              const selected = isSelected(value, option.value);
              return (
                <button
                  aria-selected={selected}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm text-muted transition-[background-color,box-shadow,color] hover:bg-[var(--accent-orange-soft)] hover:text-[var(--accent-orange-active)] focus-visible:outline-none",
                    (selected || highlightedIndex === index) && "bg-[var(--accent-orange-soft)] text-[var(--accent-orange-active)] shadow-[var(--shadow-inset)]",
                    option.disabled && "cursor-not-allowed opacity-45",
                  )}
                  disabled={option.disabled}
                  id={`${listboxId}-${index}`}
                  key={option.value}
                  onClick={() => choose(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  role="option"
                  type="button"
                >
                  <span className="truncate">{option.label}</span>
                  {selected && <Check aria-hidden="true" className="size-4 shrink-0 text-primary" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
