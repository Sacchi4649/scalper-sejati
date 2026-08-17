import { cache } from "react";
import { redirect } from "next/navigation";
import type { AppRole, Profile } from "@/lib/database.types";
import { productsPath } from "@/lib/product-languages";
import { createClient } from "@/lib/supabase/server";

export type AuthUser = {
  id: string;
  email: string;
};

export const getAuthUser = cache(async (): Promise<AuthUser | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const sub = data?.claims?.sub;

  if (error || typeof sub !== "string" || !sub) {
    return null;
  }

  const email = data.claims.email;

  return {
    id: sub,
    email: typeof email === "string" ? email : "",
  };
});

export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const user = await getAuthUser();
  if (!user) {
    return null;
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return profile;
});

export const requireProfile = cache(async () => {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect("/login");
  }
  return profile;
});

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
