import { getAuthUser, requireProfile } from "@/lib/auth";
import { ProfileSettings } from "@/components/profile-settings";
import { PageHeader } from "@/components/ui/card";

export default async function ProfilePage() {
  const [profile, user] = await Promise.all([
    requireProfile(),
    getAuthUser(),
  ]);

  return (
    <div>
      <PageHeader
        title="Profil"
        description="Perbarui nama tampilan dan kata sandi akun Anda."
      />
      <ProfileSettings profile={profile} email={user?.email ?? ""} />
    </div>
  );
}
