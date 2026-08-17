import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useId } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { useCreateLabel, useUpdateLabel } from "../../services/useLabels";
import type { Label } from "../../types/label";
import { getApiErrorMessage } from "../../utils/apiError";

const labelSchema = z.object({
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Choose a valid color."),
  name: z
    .string()
    .trim()
    .min(1, "Enter a label name.")
    .max(50, "Label name cannot exceed 50 characters."),
});
type LabelValues = z.infer<typeof labelSchema>;

export function LabelFormDialog({
  onClose,
  projectId,
  label,
}: {
  onClose: () => void;
  projectId: string;
  label?: Label;
}) {
  const createLabel = useCreateLabel();
  const updateLabel = useUpdateLabel();
  const editing = Boolean(label);
  const formId = useId();
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<LabelValues>({
    defaultValues: { color: "#DD7228", name: "" },
    resolver: zodResolver(labelSchema),
  });
  useEffect(() => {
    reset({
      color: label?.color ?? "#DD7228",
      name: label?.name ?? "",
    });
  }, [label, reset]);
  const pending = createLabel.isPending || updateLabel.isPending;
  const error = editing ? updateLabel.error : createLabel.error;
  const submit = (data: LabelValues) =>
    editing && label
      ? updateLabel.mutate(
          { data, labelId: label.id, projectId },
          { onSuccess: onClose },
        )
      : createLabel.mutate({ data, projectId }, { onSuccess: onClose });
  return (
    <Modal
      footer={
        <div className="ml-auto flex items-center gap-3">
          <Button disabled={pending} onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button form={formId} isLoading={pending} type="submit">
            {editing ? "Save changes" : "Create label"}
          </Button>
        </div>
      }
      isOpen
      onClose={onClose}
      size="compact"
      title={editing ? "Edit label" : "Create label"}
    >
      <form className="space-y-4" id={formId} noValidate onSubmit={handleSubmit(submit)}>
        {error && (
          <div
            className="rounded-lg border border-danger/40 bg-danger/10 px-3 py-3 text-sm text-danger"
            role="alert"
          >
            {getApiErrorMessage(
              error,
              "Unable to save the label. Please try again.",
            )}
          </div>
        )}
        <Input
          autoFocus
          disabled={pending}
          error={errors.name?.message}
          label="Label name"
          {...register("name")}
        />
        <label
          className="flex items-center justify-between gap-4 rounded-lg border border-border bg-app px-3 py-2.5 text-sm font-medium text-text"
          htmlFor="label-color"
        >
          <span>Label color</span>
          <input
            className="size-10 shrink-0 cursor-pointer rounded-lg border border-border-subtle bg-transparent p-1"
            disabled={pending}
            id="label-color"
            type="color"
            {...register("color")}
          />
        </label>
        {errors.color && (
          <p className="text-sm text-danger">{errors.color.message}</p>
        )}
      </form>
    </Modal>
  );
}
