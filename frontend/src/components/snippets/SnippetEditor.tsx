import Editor from "@monaco-editor/react";
import {
  Maximize2,
  ChevronDown,
} from "lucide-react";

import { editorOptions } from "../../features/snippets/editorOptions";
import { languageMap } from "../../features/snippets/languages";
import { useTheme } from "../../context/ThemeContext";

type SnippetEditorProps = {
  className?: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
  value: string;
  language: string;
};

export function SnippetEditor({
  className,
  disabled = false,
  error,
  language,
  onChange,
  value,
}: SnippetEditorProps) {
  const { theme } = useTheme();

  const editorTheme =
    theme === "dark" ? "vs-dark" : "vs";

  return (
    <div
      className={`grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)_auto] gap-2 text-sm font-medium text-text ${className ?? ""}`}
    >
      {/* Editor toolbar */}
      <div className="flex shrink-0 items-center justify-between">
        <span className="text-sm font-medium text-text">
          Code
        </span>

        <div className="flex items-center gap-2">
          <button
            className="flex h-8 items-center gap-2 rounded-lg border border-border bg-app px-3 text-xs font-medium text-text transition hover:bg-elevated"
            type="button"
          >
            {theme === "dark" ? "Dark" : "Light"}

            <ChevronDown className="size-3.5 text-muted" />
          </button>

          <button
            aria-label="Expand editor"
            className="flex size-8 items-center justify-center rounded-lg border border-border bg-app text-muted transition hover:bg-elevated hover:text-text"
            title="Expand editor"
            type="button"
          >
            <Maximize2 className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Monaco */}
      <div className="min-h-0 overflow-hidden rounded-lg border border-border bg-app focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <Editor
          height="100%"
          language={languageMap[language] ?? language}
          onChange={(next) =>
            onChange(next ?? "")
          }
          options={{
            ...editorOptions,
            readOnly: disabled,
            domReadOnly: disabled,
          }}
          theme={editorTheme}
          value={value}
        />
      </div>

      {error && (
        <span className="text-xs text-danger">
          {error}
        </span>
      )}
    </div>
  );
}