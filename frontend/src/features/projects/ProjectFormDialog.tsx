import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Textarea } from "../../components/ui/Textarea";
import { useCreateProject, useUpdateProject } from "../../services/useProjects";
import type { Project } from "../../types/project";
import { getApiErrorMessage } from "../../utils/apiError";
import {
  projectColors,
  projectSchema,
  type ProjectFormValues,
} from "./projectSchemas";

type ProjectFormDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
};

const defaultValues: ProjectFormValues = {
  color: "",
  description: "",
  name: "",
};

export function ProjectFormDialog({
  isOpen,
  onClose,
  project,
}: ProjectFormDialogProps) {
  const isEditing = Boolean(project);
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const resetCreateProject = createProject.reset;
  const resetUpdateProject = updateProject.reset;
  const formId = useId();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<ProjectFormValues>({
    defaultValues,
    resolver: zodResolver(projectSchema),
  });

  useEffect(() => {
    if (!isOpen) return;

    reset(
      project
        ? {
            color:
              project.color &&
              projectColors.includes(
                project.color as (typeof projectColors)[number],
              )
                ? (project.color as (typeof projectColors)[number])
                : "",
            description: project.description ?? "",
            name: project.name,
          }
        : defaultValues,
    );
    resetCreateProject();
    resetUpdateProject();
  }, [isOpen, project, reset, resetCreateProject, resetUpdateProject]);

  const isPending = createProject.isPending || updateProject.isPending;
  const selectedColor = watch("color");
  const onSubmit = (values: ProjectFormValues) => {
    const payload = {
      ...values,
      color: values.color || undefined,
      description: values.description || null,
    };

    if (project) {
      updateProject.mutate(
        { projectId: project.id, payload },
        { onSuccess: onClose },
      );
      return;
    }

    createProject.mutate(payload, { onSuccess: onClose });
  };

  return (
    <Modal
      footer={
        <div className="ml-auto flex items-center gap-3">
          <Button disabled={isPending} onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button form={formId} isLoading={isPending} type="submit">
            {isEditing ? "Save changes" : "Create project"}
          </Button>
        </div>
      }
      isOpen={isOpen}
      onClose={onClose}
      size="medium"
      title={isEditing ? "Edit project" : "Create project"}
    >
      <form className="space-y-5" id={formId} noValidate onSubmit={handleSubmit(onSubmit)}>
        {(isEditing ? updateProject.error : createProject.error) && (
          <div
            className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-3 text-sm text-danger"
            role="alert"
          >
            {getApiErrorMessage(
              isEditing ? updateProject.error : createProject.error,
              "Unable to save the project. Please try again.",
            )}
          </div>
        )}
        <Input
          autoFocus
          disabled={isPending}
          error={errors.name?.message}
          label="Project name"
          maxLength={100}
          placeholder="e.g. DevBoard redesign"
          {...register("name")}
        />
        <Textarea
          className="min-h-28 resize-none"
          disabled={isPending}
          error={errors.description?.message}
          label="Description"
          maxLength={500}
          placeholder="What are you building?"
          {...register("description")}
        />
        <fieldset className="grid gap-2">
          <legend className="text-sm font-medium text-text">Project color</legend>
          <input type="hidden" {...register("color")} />
          <div className="flex flex-wrap gap-2">
            <button
              aria-label="No project color"
              aria-pressed={!selectedColor}
              className={`flex size-10 shrink-0 items-center justify-center rounded-lg border bg-app text-xs text-muted transition focus:outline-none focus:ring-2 focus:ring-primary/40 ${!selectedColor ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted"}`}
              disabled={isPending}
              onClick={() => setValue("color", "", { shouldDirty: true })}
              type="button"
            >
              —
            </button>
            {projectColors.map((color) => (
              <button
                aria-label={`Use ${color} as the project color`}
                aria-pressed={selectedColor === color}
                className={`size-10 shrink-0 rounded-lg border-2 transition focus:outline-none focus:ring-2 focus:ring-primary/40 ${selectedColor === color ? "border-text ring-2 ring-primary/30" : "border-transparent hover:scale-105"}`}
                disabled={isPending}
                key={color}
                onClick={() => setValue("color", color, { shouldDirty: true })}
                style={{ backgroundColor: color }}
                type="button"
              />
            ))}
          </div>
        </fieldset>
      </form>
    </Modal>
  );
}
