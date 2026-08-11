import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useProjects } from "../../services/useProjects";
import type { Note, NoteInput } from "../../types/note";

import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

const schema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Enter a note title.")
    .max(150, "Title cannot exceed 150 characters."),

  content: z
    .string()
    .trim()
    .min(1, "Enter note content.")
    .max(50000, "Content cannot exceed 50,000 characters."),

  projectId: z.string().optional(),
});

type Values = z.infer<typeof schema>;

export function NoteForm({
  note,
  isSubmitting,
  onSubmit,
  formId,
}: {
  note?: Note;
  isSubmitting: boolean;
  onSubmit: (input: NoteInput) => void;
  formId?: string;
}) {
  const { data: projects } = useProjects({
    limit: 100,
    sort: "name",
    order: "asc",
  });

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<Values>({
    defaultValues: {
      title: note?.title ?? "",
      content: note?.content ?? "",
      projectId: note?.projectId ?? "",
    },
    resolver: zodResolver(schema),
  });

  const onValid = (values: Values) => {
    console.log("FORM VALUES:", values);

    const payload: NoteInput = {
      ...values,
      projectId: values.projectId || null,
    };

    console.log("API PAYLOAD:", payload);

    onSubmit(payload);
  };

  return (
    <form
      className="space-y-5"
      id={formId}
      noValidate
      onSubmit={handleSubmit(onValid)}
    >
      <Input
        autoFocus
        disabled={isSubmitting}
        error={errors.title?.message}
        label="Title"
        {...register("title")}
      />

      <Textarea
        className="h-[clamp(18rem,42vh,32rem)] resize-none"
        disabled={isSubmitting}
        error={errors.content?.message}
        label="Content"
        {...register("content")}
      />

      <label
        className="grid gap-2 text-sm font-medium text-text"
        htmlFor="note-project"
      >
        Project (optional)

        <select
          className="min-h-10 rounded-lg border border-border bg-app px-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          disabled={isSubmitting}
          id="note-project"
          {...register("projectId")}
        >
          <option value="">Personal Note</option>

          {projects?.projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </label>

    </form>
  );
}
