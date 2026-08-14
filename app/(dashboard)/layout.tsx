import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { requireProfile } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const profile = await requireProfile();
  return <AppShell profile={profile}>{children}</AppShell>;
}
