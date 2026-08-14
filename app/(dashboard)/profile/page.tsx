import { requireProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ProfileSettings } from "@/components/profile-settings";
import { PageHeader } from "@/components/ui/card";

export default async function ProfilePage() {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <div>
      <PageHeader
        title="Profil"
        description="Perbarui nama tampilan dan kata sandi akun Anda."
      />
      <ProfileSettings profile={profile} email={data.user?.email ?? ""} />
    </div>
  );
}
