Avatar display and upload-specific UI logic live here; Supabase initialization and low-level backend callers do not belong here.

The uploader validates PNG, JPEG, and WebP files up to 5 MB, requests a signed upload target from the API, uploads directly to Supabase Storage, then confirms the storage path with the API.  The avatar query is refreshed after confirmation, so every `UserAvatar` updates without a page reload.
