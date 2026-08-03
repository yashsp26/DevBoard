import axios from 'axios'

/** Uploads directly to Supabase Storage without app API headers or base URL. */
export async function uploadToSupabase(
  uploadUrl: string,
  file: File,
  onProgress?: (progress: number) => void,
): Promise<void> {
  await axios.put(uploadUrl, file, {
    headers: { 'Content-Type': file.type },
    onUploadProgress: ({ loaded, total }) => {
      if (total) onProgress?.(Math.round((loaded / total) * 100))
    },
  })
}
