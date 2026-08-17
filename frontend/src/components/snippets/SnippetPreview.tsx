import Editor from "@monaco-editor/react";
import { editorOptions } from "../../features/snippets/editorOptions";
import {
  languageMap,
  type SnippetLanguage,
} from "../../features/snippets/languages";
import { useTheme } from "../../context/ThemeContext";

export function SnippetPreview({
  code,
  language,
}: {
  code: string;
  language: SnippetLanguage;
}) {
  const { theme } = useTheme();
  return (
    <div className="neu-inset overflow-hidden rounded-xl border border-transparent bg-[var(--color-surface-input)]">
      <Editor
        height="360px"
        language={languageMap[language] ?? language}
        options={{ ...editorOptions, readOnly: true, domReadOnly: true }}
        theme={theme === "dark" ? "vs-dark" : "vs"}
        value={code}
      />
    </div>
  );
}
