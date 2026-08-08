import { type ComponentProps } from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "../ui/Button";

type ActionIconButtonProps = Omit<
  ComponentProps<typeof Button>,
  "children" | "size"
> & {
  icon: LucideIcon;
  iconClassName?: string;
};

export function ActionIconButton({
  className,
  icon: Icon,
  iconClassName,
  ...props
}: ActionIconButtonProps) {
  return (
    <Button
      {...props}
      className={cn(
        "h-9 w-9 min-h-0 shrink-0 p-0 hover:bg-elevated",
        className,
      )}
      size="icon"
      variant={props.variant ?? "ghost"}
    >
      <Icon aria-hidden="true" className={cn("size-4", iconClassName)} />
    </Button>
  );
}
