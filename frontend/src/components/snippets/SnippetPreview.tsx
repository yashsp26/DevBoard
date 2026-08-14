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
    <div className="overflow-hidden rounded-lg border border-border bg-app">
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
