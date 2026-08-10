import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Play } from "lucide-react";
import { languages } from "../../features/snippets/languages";
import { useRunExecution } from "../../services/useExecution";
import { useProjects } from "../../services/useProjects";
import type { Snippet, SnippetInput } from "../../types/snippet";
import { toast } from "sonner";
import { Button } from "../ui/Button";
import { ExecutionOutput } from "./ExecutionOutput";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { SnippetEditor } from "./SnippetEditor";

const schema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must be at least 2 characters.")
    .max(120),
  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters."),
  language: z.string().min(1, "Choose a language."),
  code: z.string().trim().min(1, "Code cannot be empty."),
  projectId: z.string(),
});
type Values = z.infer<typeof schema>;

export function SnippetForm({
  formId,
  snippet,
  isSubmitting,
  onSubmit,
}: {
  formId: string;
  snippet?: Snippet;
  isSubmitting: boolean;
  onSubmit: (input: SnippetInput) => void;
}) {
  const { data: projects } = useProjects({
    limit: 100,
    sort: "name",
    order: "asc",
  });
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<Values>({
    defaultValues: {
      title: snippet?.title ?? "",
      description: snippet?.description ?? "",
      language: snippet?.language ?? "typescript",
      code: snippet?.code ?? "",
      projectId: snippet?.projectId ?? "",
    },
    resolver: zodResolver(schema),
  });
  const language = watch("language");
  const execution = useRunExecution();
  return (
    <form
      className="space-y-5"
      id={formId}
      noValidate
      onSubmit={handleSubmit((values) =>
        onSubmit({
          title: values.title,
          description: values.description || null,
          language: values.language,
          code: values.code,
          projectId: values.projectId || null,
        }),
      )}
    >
      <Input
        autoFocus
        disabled={isSubmitting}
        error={errors.title?.message}
        label="Title"
        {...register("title")}
      />
      <Textarea
        disabled={isSubmitting}
        error={errors.description?.message}
        label="Description (optional)"
        {...register("description")}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <label
          className="grid gap-2 text-sm font-medium text-text"
          htmlFor="snippet-language"
        >
          Language
          <select
            className="min-h-10 rounded-lg border border-border bg-app px-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            disabled={isSubmitting}
            id="snippet-language"
            {...register("language")}
          >
            <option value="">Select language</option>
            {languages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.language && (
            <span className="text-xs text-danger">
              {errors.language.message}
            </span>
          )}
        </label>
        <label
          className="grid gap-2 text-sm font-medium text-text"
          htmlFor="snippet-project"
        >
          Project (optional)
          <select
            className="min-h-10 rounded-lg border border-border bg-app px-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            disabled={isSubmitting}
            id="snippet-project"
            {...register("projectId")}
          >
            <option value="">Personal snippet</option>
            {projects?.projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Controller
        control={control}
        name="code"
        render={({ field }) => (
          <div className="space-y-3">
            <SnippetEditor
              disabled={isSubmitting}
              error={errors.code?.message}
              language={language}
              onChange={(value) => field.onChange(value)}
              value={field.value}
            />
            <div className="flex justify-end">
              <Button
                disabled={isSubmitting}
                isLoading={execution.isRunning}
                onClick={() => {
                  if (!field.value.trim()) {
                    toast.error("Nothing to run.");
                    return;
                  }

                  execution.run({
                    language: "javascript",
                    framework: "node",
                    entryPoint: "index.js",
                    files: [{ path: "index.js", content: field.value }],
                    stdin: "",
                    timeoutMs: 10000,
                  });
                }}
              >
                {!execution.isRunning && <Play aria-hidden="true" className="size-4" />}
                {execution.isRunning ? "Running..." : "Run"}
              </Button>
            </div>
            {execution.state.status !== "idle" && (
              <ExecutionOutput
                onClose={execution.clear}
                state={execution.state}
              />
            )}
          </div>
        )}
      />
    </form>
  );
}
