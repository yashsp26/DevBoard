import { ImageIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '../../utils/cn'

type AvatarSize = 'sm' | 'md' | 'lg'

type AvatarProps = {
  alt: string
  className?: string
  size?: AvatarSize
  src?: string | null
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-14 text-base',
}

export function Avatar({ alt, className, size = 'md', src }: AvatarProps) {
  const [hasImage, setHasImage] = useState(Boolean(src))

  useEffect(() => {
    setHasImage(Boolean(src))
  }, [src])

  if (src && hasImage) {
    return (
      <img
        alt={alt}
        className={cn('rounded-full border border-border object-cover', sizeClasses[size], className)}
        loading="lazy"
        onError={() => setHasImage(false)}
        src={src}
      />
    )
  }

  return (
    <span
      aria-label={alt}
      className={cn('inline-flex items-center justify-center rounded-full border border-border-subtle bg-elevated text-muted', sizeClasses[size], className)}
      role="img"
    >
      <ImageIcon aria-hidden="true" className="size-1/2" />
    </span>
  )
}
