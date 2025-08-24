import { User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type UserAvatarProps = {
  className?: string;
  iconClassName?: string;
  size?: number | string;
  src?: string;
  alt?: string;
};

export function UserAvatar({ className, iconClassName, size, src, alt }: UserAvatarProps) {
  const style =
    size != null ? { width: size as number | string, height: size as number | string } : undefined;
  const fallbackIconClassName = [
    iconClassName,
    !iconClassName && !className ? 'text-muted-foreground' : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Avatar className={className} style={style}>
      {src ? (
        <AvatarImage src={src} alt={alt || 'Profile picture'} className="object-cover" />
      ) : null}
      <AvatarFallback>
        <UserIcon className={fallbackIconClassName} />
      </AvatarFallback>
    </Avatar>
  );
}
