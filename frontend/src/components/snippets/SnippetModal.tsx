import { useId } from "react";

import {
  useCreateSnippet,
  useUpdateSnippet,
} from "../../services/useSnippets";

import type { Snippet } from "../../types/snippet";

import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { SnippetForm } from "./SnippetForm";

export function SnippetModal({
  snippet,
  onClose,
}: {
  snippet?: Snippet;
  onClose: () => void;
}) {
  const create = useCreateSnippet();
  const update = useUpdateSnippet();

  const formId = useId();

  const mutation = snippet ? update : create;

  return (
    <Modal
      bodyClassName="min-h-0 flex-1 overflow-hidden p-0"
      footer={
        <>
          <span className="text-xs text-muted">
            Last updated: 2 minutes ago
          </span>

          <div className="flex items-center gap-3">
            <Button
              disabled={mutation.isPending}
              onClick={onClose}
              variant="secondary"
            >
              Cancel
            </Button>

            <Button
              form={formId}
              isLoading={mutation.isPending}
              type="submit"
            >
              {snippet
                ? "Save changes"
                : "Create snippet"}
            </Button>
          </div>
        </>
      }
      isOpen
      onClose={onClose}
      size="wide"
      subtitle="Update your snippet and test your code"
      title={
        snippet
          ? "Edit snippet"
          : "Create snippet"
      }
    >
      <SnippetForm
        formId={formId}
        isSubmitting={mutation.isPending}
        onSubmit={(payload) =>
          snippet
            ? update.mutate(
                {
                  id: snippet.id,
                  payload,
                },
                {
                  onSuccess: onClose,
                },
              )
            : create.mutate(payload, {
                onSuccess: onClose,
              })
        }
        snippet={snippet}
      />
    </Modal>
  );
}