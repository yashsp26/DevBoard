-- PostgreSQL treats NULL values as distinct, so standalone snippets remain
-- unrestricted while each non-null project/file-path pair is unique.
ALTER TABLE "Snippet" ADD COLUMN "filePath" VARCHAR(512);

CREATE UNIQUE INDEX "Snippet_projectId_filePath_key"
ON "Snippet"("projectId", "filePath");
