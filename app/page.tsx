import { redirect } from "next/navigation";
import { getCurrentProfile, homePathForRole } from "@/lib/auth";

export default async function HomePage() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/login");
  }
  redirect(homePathForRole(profile.role));
}
