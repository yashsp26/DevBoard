import { useNavigate } from "react-router";
import { UserAvatar } from "../common/UserAvatar";
import { Dropdown } from "../ui/Dropdown";
import { useLogout } from "../../services/useLogout";
import { useProfile } from "../../services/useProfile";

export function UserMenu() {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { isPending, mutate } = useLogout();
  const displayName = profile?.name ?? "Account";

  return (
    <Dropdown
      items={[
        {
          label: "Profile",
          onSelect: () => navigate("/profile"),
        },
        {
          disabled: isPending,
          label: isPending ? "Signing out..." : "Sign out",
          onSelect: () => mutate(),
        },
      ]}
      label="Account menu"
      triggerContent={
        <>
          <UserAvatar
            alt={`${displayName}'s avatar`}
            fallbackSrc={profile?.profile?.avatar}
            size="sm"
          />
          <span className="max-w-32 truncate">{displayName}</span>
        </>
      }
    />
  );
}
