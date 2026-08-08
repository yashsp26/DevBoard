import { AlertCircle, Plus, SearchX } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { DeleteNoteDialog } from "../components/notes/DeleteNoteDialog";
import { EmptyNotes } from "../components/notes/EmptyNotes";
import { LoadingNotes } from "../components/notes/LoadingNotes";
import { NoteCard } from "../components/notes/NoteCard";
import { NoteModal } from "../components/notes/NoteModal";
import { EmptyState } from "../components/common/EmptyState";
import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/ui/Button";
import { useNotes } from "../hooks/notes/useNotes";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useProjects } from "../services/useProjects";
import type { Note, NoteListParams } from "../types/note";

const pageSize = 12;
export function NotesPage() {
  const [params, setParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(params.get("search") ?? "");
  const [editing, setEditing] = useState<Note | undefined>();
  const [deleting, setDeleting] = useState<Note | undefined>();
  const [creating, setCreating] = useState(false);
  const search = params.get("search") ?? "";
  const debouncedSearch = useDebouncedValue(searchValue);
  const update = useCallback(
    (values: Record<string, string | undefined>, resetPage = true) =>
      setParams((current) => {
        const next = new URLSearchParams(current);
        Object.entries(values).forEach(([key, value]) =>
          value ? next.set(key, value) : next.delete(key),
        );
        if (resetPage) next.delete("page");
        return next;
      }),
    [setParams],
  );
  useEffect(() => setSearchValue(search), [search]);
  useEffect(() => {
    if (debouncedSearch !== search)
      update({ search: debouncedSearch || undefined });
  }, [debouncedSearch, search, update]);
  useEffect(() => {
    if (params.get("modal") !== "create") return;
    setCreating(true);
    setParams((current) => {
      const next = new URLSearchParams(current);
      next.delete("modal");
      return next;
    });
  }, [params, setParams]);
  const page = Math.max(Number(params.get("page")) || 1, 1);
  const sortValue = params.get("sort");
  const sort: NoteListParams["sort"] =
    sortValue === "createdAt" || sortValue === "title"
      ? sortValue
      : "updatedAt";
  const order: NoteListParams["order"] =
    params.get("order") === "asc" ? "asc" : "desc";
  const projectId = params.get("projectId") ?? undefined;
  const query = useMemo<NoteListParams>(
    () => ({
      limit: pageSize,
      order,
      page,
      projectId,
      search: search || undefined,
      sort,
    }),
    [order, page, projectId, search, sort],
  );
  const { data, error, isError, isLoading, refetch } = useNotes(query);
  const { data: projects } = useProjects({
    limit: 100,
    order: "asc",
    sort: "name",
  });
  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-6 py-10 sm:px-8">
      <PageHeader
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus aria-hidden="true" className="size-4" />
            Create Note
          </Button>
        }
        description="Personal and project notes"
        title="Notes"
      />
      <section aria-label="Note controls" className="space-y-3">
        <label className="relative block" htmlFor="note-search">
          <span className="sr-only">Search notes</span>
          <input
            className="min-h-10 w-full rounded-lg border border-border bg-app px-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            id="note-search"
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search notes..."
            type="search"
            value={searchValue}
          />
        </label>
        <div className="flex flex-wrap gap-3">
          <select
            aria-label="Filter by project"
            className="min-h-10 rounded-lg border border-border bg-app px-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            onChange={(event) =>
              update({ projectId: event.target.value || undefined })
            }
            value={projectId ?? ""}
          >
            <option value="">All Projects</option>
            {projects?.projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <select
            aria-label="Sort notes"
            className="min-h-10 rounded-lg border border-border bg-app px-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            onChange={(event) => update({ sort: event.target.value })}
            value={sort}
          >
            <option value="updatedAt">Last updated</option>
            <option value="createdAt">Date created</option>
            <option value="title">Title</option>
          </select>
          <select
            aria-label="Sort order"
            className="min-h-10 rounded-lg border border-border bg-app px-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            onChange={(event) => update({ order: event.target.value })}
            value={order}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </section>
      {isLoading ? (
        <LoadingNotes />
      ) : isError ? (
        <EmptyState
          action={<Button onClick={() => void refetch()}>Try again</Button>}
          description={
            error instanceof Error
              ? error.message
              : "We couldn’t load notes. Please try again."
          }
          icon={AlertCircle}
          title="Notes unavailable"
        />
      ) : data?.notes.length ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={setDeleting}
                onEdit={setEditing}
              />
            ))}
          </div>
          {data.pagination.totalPages > 1 && (
            <nav
              aria-label="Note pagination"
              className="flex items-center justify-between"
            >
              <span className="text-sm text-muted">
                Page {data.pagination.page} of {data.pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  disabled={page <= 1}
                  onClick={() => update({ page: String(page - 1) }, false)}
                  variant="secondary"
                >
                  Previous
                </Button>
                <Button
                  disabled={page >= data.pagination.totalPages}
                  onClick={() => update({ page: String(page + 1) }, false)}
                  variant="secondary"
                >
                  Next
                </Button>
              </div>
            </nav>
          )}
        </>
      ) : search || projectId ? (
        <EmptyState
          action={<Button onClick={() => setParams({})}>Clear filters</Button>}
          description="Try changing or clearing your filters."
          icon={SearchX}
          title="No matching notes"
        />
      ) : (
        <EmptyNotes onCreate={() => setCreating(true)} />
      )}
      {creating && <NoteModal onClose={() => setCreating(false)} />}
      {editing && (
        <NoteModal note={editing} onClose={() => setEditing(undefined)} />
      )}
      {deleting && (
        <DeleteNoteDialog
          note={deleting}
          onClose={() => setDeleting(undefined)}
        />
      )}
    </main>
  );
}
