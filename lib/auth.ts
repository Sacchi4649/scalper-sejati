import { cache } from "react";
import { redirect } from "next/navigation";
import type { AppRole, Profile } from "@/lib/database.types";
import { productsPath } from "@/lib/product-languages";
import { createClient } from "@/lib/supabase/server";

export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", data.claims.sub)
    .maybeSingle();

  return profile;
});

export async function requireProfile() {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/login");
  }
  return profile;
}

export async function requireRole(role: AppRole) {
  const profile = await requireProfile();
  if (profile.role !== role) {
    redirect(homePathForRole(profile.role));
  }
  return profile;
}

export function homePathForRole(role: AppRole) {
  return role === "super_admin" ? "/summary" : productsPath();
}
