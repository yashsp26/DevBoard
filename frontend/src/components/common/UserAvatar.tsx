import { useAvatar } from '../../services/useAvatar'
import { Avatar } from '../ui/Avatar'

type UserAvatarProps = {
  alt: string
  fallbackSrc?: string | null
  size?: 'sm' | 'md' | 'lg'
}

export function UserAvatar({ alt, fallbackSrc, size }: UserAvatarProps) {
  const { data: avatarUrl, isSuccess } = useAvatar()

  return <Avatar alt={alt} size={size} src={isSuccess ? avatarUrl : fallbackSrc} />
}
