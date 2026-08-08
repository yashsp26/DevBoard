import { AlertCircle, Plus, SearchX } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { DeleteSnippetDialog } from "../components/snippets/DeleteSnippetDialog";
import { SnippetCard } from "../components/snippets/SnippetCard";
import { SnippetDetailsModal } from "../components/snippets/SnippetDetailsModal";
import { SnippetModal } from "../components/snippets/SnippetModal";
import { EmptyState } from "../components/common/EmptyState";
import { PageHeader } from "../components/common/PageHeader";
import { Button } from "../components/ui/Button";
import { languages } from "../features/snippets/languages";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useProjects } from "../services/useProjects";
import { useSnippets, useToggleSnippetFavorite } from "../services/useSnippets";
import type { Snippet, SnippetListParams } from "../types/snippet";

const pageSize = 12;
export function SnippetsPage() {
  const [params, setParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(params.get("search") ?? "");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Snippet>();
  const [viewing, setViewing] = useState<Snippet>();
  const [deleting, setDeleting] = useState<Snippet>();
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
  const projectId = params.get("projectId") ?? undefined;
  const language = params.get("language") ?? undefined;
  const favorite = params.get("favorite") === "true" ? true : undefined;
  const sortParam = params.get("sort");
  const sort: SnippetListParams["sort"] =
    sortParam === "createdAt" ||
    sortParam === "title" ||
    sortParam === "language"
      ? sortParam
      : "updatedAt";
  const order: SnippetListParams["order"] =
    params.get("order") === "asc" ? "asc" : "desc";
  const query = useMemo<SnippetListParams>(
    () => ({
      page,
      limit: pageSize,
      search: search || undefined,
      projectId,
      language,
      favorite,
      sort,
      order,
    }),
    [favorite, language, order, page, projectId, search, sort],
  );
  const { data, error, isError, isLoading, refetch } = useSnippets(query);
  const { data: projects } = useProjects({
    limit: 100,
    sort: "name",
    order: "asc",
  });
  const toggle = useToggleSnippetFavorite();
  const filtered = Boolean(search || projectId || language || favorite);
  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-6 py-10 sm:px-8">
      <PageHeader
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus aria-hidden="true" className="size-4" />
            Create Snippet
          </Button>
        }
        description="Save and organize reusable code"
        title="Snippets"
      />
      <section aria-label="Snippet controls" className="space-y-3">
        <label className="relative block" htmlFor="snippet-search">
          <span className="sr-only">Search snippets</span>
          <input
            className="min-h-10 w-full rounded-lg border border-border bg-app px-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            id="snippet-search"
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search snippets..."
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
            aria-label="Filter by language"
            className="min-h-10 rounded-lg border border-border bg-app px-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            onChange={(event) =>
              update({ language: event.target.value || undefined })
            }
            value={language ?? ""}
          >
            <option value="">All languages</option>
            {languages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            aria-label="Filter by favorite status"
            className="min-h-10 rounded-lg border border-border bg-app px-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            onChange={(event) =>
              update({ favorite: event.target.value || undefined })
            }
            value={favorite ? "true" : ""}
          >
            <option value="">All Snippets</option>
            <option value="true">Favorites</option>
          </select>
          <select
            aria-label="Sort snippets"
            className="min-h-10 rounded-lg border border-border bg-app px-3 text-sm text-text outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            onChange={(event) => update({ sort: event.target.value })}
            value={sort}
          >
            <option value="updatedAt">Last updated</option>
            <option value="createdAt">Date created</option>
            <option value="title">Title</option>
            <option value="language">Language</option>
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
        <div
          aria-label="Loading snippets"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          role="status"
        >
          {Array.from({ length: 6 }, (_, i) => (
            <div
              className="h-60 animate-pulse rounded-xl border border-border bg-elevated"
              key={i}
            />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          action={<Button onClick={() => void refetch()}>Try again</Button>}
          description={
            error instanceof Error
              ? error.message
              : "We couldn’t load snippets. Please try again."
          }
          icon={AlertCircle}
          title="Snippets unavailable"
        />
      ) : data?.snippets.length ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.snippets.map((snippet) => (
              <SnippetCard
                isTogglingFavorite={
                  toggle.isPending && toggle.variables === snippet.id
                }
                key={snippet.id}
                onDelete={setDeleting}
                onEdit={setEditing}
                onToggleFavorite={(item) => toggle.mutate(item.id)}
                onView={setViewing}
                snippet={snippet}
              />
            ))}
          </div>
          {data.pagination.totalPages > 1 && (
            <nav
              aria-label="Snippet pagination"
              className="flex items-center justify-between"
            >
              <span className="text-sm text-muted">
                Page {data.pagination.page} of {data.pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  disabled={!data.pagination.hasPreviousPage}
                  onClick={() => update({ page: String(page - 1) }, false)}
                  variant="secondary"
                >
                  Previous
                </Button>
                <Button
                  disabled={!data.pagination.hasNextPage}
                  onClick={() => update({ page: String(page + 1) }, false)}
                  variant="secondary"
                >
                  Next
                </Button>
              </div>
            </nav>
          )}
        </>
      ) : filtered ? (
        <EmptyState
          action={<Button onClick={() => setParams({})}>Clear filters</Button>}
          description="Try changing or clearing your filters."
          icon={SearchX}
          title="No matching snippets"
        />
      ) : (
        <EmptyState
          action={
            <Button onClick={() => setCreating(true)}>
              <Plus aria-hidden="true" className="size-4" />
              Create snippet
            </Button>
          }
          description="Save your first reusable piece of code."
          icon={SearchX}
          title="No snippets yet"
        />
      )}
      {creating && <SnippetModal onClose={() => setCreating(false)} />}
      {editing && (
        <SnippetModal onClose={() => setEditing(undefined)} snippet={editing} />
      )}
      {viewing && (
        <SnippetDetailsModal
          onClose={() => setViewing(undefined)}
          snippet={viewing}
        />
      )}
      {deleting && (
        <DeleteSnippetDialog
          onClose={() => setDeleting(undefined)}
          snippet={deleting}
        />
      )}
    </main>
  );
}
