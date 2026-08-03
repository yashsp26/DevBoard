import { DangerZoneSection } from "./DangerZoneSection";
import { PasswordChangeSection } from "./PasswordChangeSection";
import { ProfileCard } from "./ProfileCard";
import { ProfileEditSection } from "./ProfileEditSection";
import type { Profile } from "../../types/profile";

type ProfileContentProps = {
  isLoading: boolean;
  profile?: Profile;
};

export function ProfileContent({ isLoading, profile }: ProfileContentProps) {
  return (
    <div className="space-y-6">
      <ProfileCard isLoading={isLoading} profile={profile} />
      <ProfileEditSection isLoading={isLoading} profile={profile} />
      <PasswordChangeSection isLoading={isLoading} />
      <DangerZoneSection isLoading={isLoading} />
    </div>
  );
}
