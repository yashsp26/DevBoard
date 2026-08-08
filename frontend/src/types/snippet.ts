export type SnippetProject = { id: string; name: string; color: string | null };

export type Snippet = {
  id: string;
  title: string;
  description: string | null;
  language: string;
  code: string;
  isFavorite: boolean;
  projectId: string | null;
  project: SnippetProject | null;
  createdAt: string;
  updatedAt: string;
};

export type SnippetInput = {
  title: string;
  description?: string | null;
  language: string;
  code: string;
  projectId?: string | null;
};
export type SnippetListParams = {
  page?: number;
  limit?: number;
  search?: string;
  projectId?: string;
  language?: string;
  favorite?: boolean;
  sort?: "createdAt" | "updatedAt" | "title" | "language";
  order?: "asc" | "desc";
};
export type SnippetListResponse = {
  snippets: Snippet[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
};
