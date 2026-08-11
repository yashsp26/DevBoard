import { apiClient } from "./client";
import type {
  Snippet,
  SnippetInput,
  SnippetListParams,
  SnippetListResponse,
} from "../types/snippet";

type ApiResponse<T> = { data: T; message: string; success: boolean };

export const snippetApi = {
  async createSnippet(payload: SnippetInput) {
    const { data } = await apiClient.post<ApiResponse<Snippet>>(
      "/v1/snippets",
      payload,
    );
    return data.data;
  },
  async getSnippets(params: SnippetListParams = {}) {
    const { data } = await apiClient.get<ApiResponse<SnippetListResponse>>(
      "/v1/snippets",
      {
        params: {
          ...params,
          favorite:
            params.favorite === undefined ? undefined : String(params.favorite),
        },
      },
    );
    return data.data;
  },
  async getSnippet(id: string) {
    const { data } = await apiClient.get<ApiResponse<Snippet>>(
      `/v1/snippets/${id}`,
    );
    return data.data;
  },
  async updateSnippet({ id, payload }: { id: string; payload: SnippetInput }) {
    const { data } = await apiClient.patch<ApiResponse<Snippet>>(
      `/v1/snippets/${id}`,
      payload,
    );
    return data.data;
  },
  async deleteSnippet(id: string) {
    await apiClient.delete(`/v1/snippets/${id}`);
  },
  async toggleFavorite(id: string) {
    const { data } = await apiClient.patch<ApiResponse<Snippet>>(
      `/v1/snippets/${id}/favorite`,
    );
    return data.data;
  },
};
