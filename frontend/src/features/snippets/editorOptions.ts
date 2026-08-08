import type { editor } from "monaco-editor";

export const editorOptions: editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  roundedSelection: false,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  wordWrap: "on",
  tabSize: 2,
  insertSpaces: true,
  padding: { top: 16, bottom: 16 },
};
