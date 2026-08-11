import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { languages } from "../../features/snippets/languages";
import { useRunExecution } from "../../services/useExecution";
import { useProjects } from "../../services/useProjects";
import type { Snippet, SnippetInput } from "../../types/snippet";
import { toast } from "sonner";
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

  projectId: z.string().optional(),
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
    register,
    watch,
    handleSubmit,
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
      className="grid h-full min-h-0 grid-cols-[minmax(0,1.65fr)_minmax(360px,1fr)] overflow-hidden"
      id={formId}
      noValidate
      onSubmit={handleSubmit((values) => {
        onSubmit({
          ...values,
          projectId: values.projectId || undefined,
        });
      })}
    >
      {/* LEFT SIDE */}
      <div className="flex min-h-0 min-w-0 flex-col border-r border-border-subtle px-5 py-4">
        {/* Top fields */}
        <div className="shrink-0 space-y-4">
          <div className="grid grid-cols-[minmax(0,1.7fr)_minmax(170px,0.8fr)_minmax(170px,0.8fr)] gap-4">
            <Input
              autoFocus
              disabled={isSubmitting}
              error={errors.title?.message}
              label="Title"
              {...register("title")}
            />

            <div className="min-w-0">
              <label
                className="mb-1.5 block text-xs font-medium text-text"
                htmlFor="snippet-language"
              >
                Language
              </label>

              <select
                className="h-10 mt-2 w-full rounded-lg border border-border bg-app px-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                <p className="mt-1 text-xs text-danger">
                  {errors.language.message}
                </p>
              )}
            </div>

            <div className="min-w-0">
              <label
                className="mb-1.5 mt-2 block text-xs font-medium text-text"
                htmlFor="snippet-project"
              >
                Project (optional)
              </label>

              <select
                className="h-10 w-full rounded-lg border border-border bg-app px-3 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
            </div>
          </div>

          <Textarea
            className="min-h-20 resize-none"
            disabled={isSubmitting}
            error={errors.description?.message}
            label="Description (optional)"
            {...register("description")}
          />
        </div>

        {/* Editor */}
        <div className="mt-4 min-h-0 flex-1">
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <SnippetEditor
                className="h-full min-h-0"
                disabled={isSubmitting}
                error={errors.code?.message}
                language={language}
                onChange={field.onChange}
                value={field.value}
              />
            )}
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <Controller
        control={control}
        name="code"
        render={({ field }) => (
          <ExecutionOutput
            isRunning={execution.isRunning}
            onRun={() => {
              if (!field.value.trim()) {
                toast.error("Nothing to run.");
                return;
              }

              execution.run({
                language: "javascript",
                framework: "node",
                entryPoint: "index.js",
                files: [
                  {
                    path: "index.js",
                    content: field.value,
                  },
                ],
                stdin: "",
                timeoutMs: 10000,
              });
            }}
            state={execution.state}
          />
        )}
      />
    </form>
  );
}
