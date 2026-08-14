import type { AppRole } from "@/lib/database.types";
import { getCurrentProfile } from "@/lib/auth";
import { ApiError } from "@/lib/http";

export async function requireApiProfile() {
  const profile = await getCurrentProfile();
  if (!profile) {
    throw new ApiError(401, "Silakan masuk terlebih dahulu");
  }
  return profile;
}

export async function requireApiRole(role: AppRole) {
  const profile = await requireApiProfile();
  if (profile.role !== role) {
    throw new ApiError(403, "Akses ditolak");
  }
  return profile;
}
