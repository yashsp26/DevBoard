import { ImagePlus, Trash2 } from 'lucide-react'
import { type ChangeEvent, useRef, useState } from 'react'
import { toast } from 'sonner'
import { UserAvatar } from '../../components/common/UserAvatar'
import { Button } from '../../components/ui/Button'
import { Skeleton } from '../../components/ui/Skeleton'
import { useAvatar, useAvatarUploadUrl, useDeleteAvatar, useSaveAvatar } from '../../hooks/useAvatar'
import { getApiErrorMessage } from '../../utils/apiError'
import { uploadToSupabase } from '../../utils/uploadToSupabase'

const allowedFileTypes = ['image/jpeg', 'image/png', 'image/webp']
const maxAvatarBytes = 5 * 1024 * 1024

type AvatarUploaderProps = {
  fallbackSrc?: string | null
  name: string
}

export function AvatarUploader({ fallbackSrc, name }: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [uploadStep, setUploadStep] = useState<string | null>(null)
  const { data: avatarUrl, isLoading: isAvatarLoading, isSuccess } = useAvatar()
  const uploadAvatarUrl = useAvatarUploadUrl()
  const saveAvatar = useSaveAvatar()
  const deleteAvatar = useDeleteAvatar()
  const isBusy = isUploading || uploadAvatarUrl.isPending || saveAvatar.isPending || deleteAvatar.isPending
  const hasAvatar = isSuccess ? Boolean(avatarUrl) : Boolean(fallbackSrc)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!allowedFileTypes.includes(file.type)) {
      toast.error('Choose a PNG, JPEG, or WebP image.')
      return
    }

    if (file.size > maxAvatarBytes) {
      toast.error('Avatar images must be 5 MB or smaller.')
      return
    }

    setIsUploading(true)
    setUploadProgress(null)

    try {
      setUploadStep('Preparing upload…')
      const target = await uploadAvatarUrl.mutateAsync({ fileName: file.name })

      setUploadStep('Uploading photo…')
      try {
        await uploadToSupabase(target.uploadUrl, file, setUploadProgress)
      } catch (error) {
        toast.error(getApiErrorMessage(error, 'The upload link may have expired. Please try again.'))
        return
      }

      setUploadStep('Saving profile photo…')
      await saveAvatar.mutateAsync({ path: target.path })
    } catch {
      // Mutations surface their own API errors. Do not save if upload never completed.
    } finally {
      setIsUploading(false)
      setUploadProgress(null)
      setUploadStep(null)
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border-subtle bg-app p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        {isAvatarLoading ? <Skeleton className="size-14 shrink-0 rounded-full" /> : <UserAvatar alt={`${name}'s avatar`} fallbackSrc={fallbackSrc} size="lg" />}
        <div>
          <p className="text-sm font-medium text-text">Profile photo</p>
          <p className="text-sm text-muted">PNG, JPEG, or WebP. Maximum 5 MB.</p>
          {uploadStep && <p aria-live="polite" className="text-sm text-primary">{uploadStep}</p>}
          {uploadProgress !== null && (
            <div aria-label={`Upload progress: ${uploadProgress}%`} aria-valuemax={100} aria-valuemin={0} aria-valuenow={uploadProgress} className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-elevated" role="progressbar">
              <div className="h-full bg-primary transition-[width]" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          disabled={isBusy}
          onChange={handleFileChange}
          ref={inputRef}
          type="file"
        />
        <Button disabled={isBusy} isLoading={isUploading || uploadAvatarUrl.isPending || saveAvatar.isPending} onClick={() => inputRef.current?.click()} variant="secondary">
          <ImagePlus aria-hidden="true" className="size-4" />
          Upload photo
        </Button>
        {hasAvatar && (
          <Button disabled={isBusy} isLoading={deleteAvatar.isPending} onClick={() => deleteAvatar.mutate()} variant="ghost">
            <Trash2 aria-hidden="true" className="size-4" />
            Remove
          </Button>
        )}
      </div>
    </div>
  )
}
