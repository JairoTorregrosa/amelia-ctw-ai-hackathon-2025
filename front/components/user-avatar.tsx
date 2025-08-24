import { User as UserIcon } from "lucide-react"

type UserAvatarProps = {
  className?: string
  iconClassName?: string
  size?: number | string
}

export function UserAvatar({ className, iconClassName, size }: UserAvatarProps) {
  const style = size != null ? { width: size as number | string, height: size as number | string } : undefined
  const computedClassName = [iconClassName, className, !iconClassName && !className ? "text-muted-foreground" : undefined]
    .filter(Boolean)
    .join(" ")
  return <UserIcon className={computedClassName} style={style} />
}


