import Editor from "@monaco-editor/react";
import { editorOptions } from "../../features/snippets/editorOptions";
import { languageMap } from "../../features/snippets/languages";
import { useTheme } from "../../context/ThemeContext";

type SnippetEditorProps = {
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
  value: string;
  language: string;
};

export function SnippetEditor({
  disabled = false,
  error,
  language,
  onChange,
  value,
}: SnippetEditorProps) {
  const { theme } = useTheme();

  return (
    <div className="grid gap-2 text-sm font-medium text-text">
      <span>Code</span>

      <div className="overflow-hidden rounded-lg border border-border bg-app focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <Editor
          height="320px"
          language={languageMap[language] ?? language}
          onChange={(next) => onChange(next ?? "")}
          options={{
            ...editorOptions,
            readOnly: disabled,
            domReadOnly: disabled,
          }}
          theme={theme === "dark" ? "vs-dark" : "vs"}
          value={value}
        />
      </div>

      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}
