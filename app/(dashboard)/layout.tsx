import type { ReactNode } from "react";
import { Suspense } from "react";
import { AppShell } from "@/components/app-shell";
import { requireProfile } from "@/lib/auth";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense>
      <AppShell profilePromise={requireProfile()}>{children}</AppShell>
    </Suspense>
  );
}
