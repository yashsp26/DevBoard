import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
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
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<LabelValues>({
    defaultValues: { color: "#3B82F6", name: "" },
    resolver: zodResolver(labelSchema),
  });
  useEffect(() => {
    reset({
      color: label?.color ?? "#3B82F6",
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
      isOpen
      onClose={onClose}
      title={editing ? "Edit label" : "Create label"}
    >
      <form className="space-y-5" noValidate onSubmit={handleSubmit(submit)}>
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
          className="grid gap-2 text-sm font-medium text-text"
          htmlFor="label-color"
        >
          Color Picker
          <input
            className="h-10 w-full cursor-pointer rounded-lg border border-border bg-app p-1"
            disabled={pending}
            id="label-color"
            type="color"
            {...register("color")}
          />
        </label>
        {errors.color && (
          <p className="text-sm text-danger">{errors.color.message}</p>
        )}
        <div className="flex justify-end gap-3">
          <Button disabled={pending} onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button isLoading={pending} type="submit">
            {editing ? "Save changes" : "Create label"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
