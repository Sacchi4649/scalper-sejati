"use client";

import { useState } from "react";
import type { Profile } from "@/lib/database.types";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export function ProfileSettings({
  profile,
  email,
}: {
  profile: Profile;
  email: string;
}) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <h2 className="mb-4 font-display text-xl">Data akun</h2>
        <NameForm profile={profile} email={email} />
      </Card>
      <Card>
        <h2 className="mb-4 font-display text-xl">Ubah kata sandi</h2>
        <PasswordForm />
      </Card>
    </div>
  );
}

function NameForm({ profile, email }: { profile: Profile; email: string }) {
  const [fullName, setFullName] = useState(profile.full_name);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await api("/api/profile", {
        method: "PATCH",
        body: JSON.stringify({ fullName }),
      });
      setMessage("Nama berhasil diperbarui.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Input
        label="Nama"
        value={fullName}
        onChange={(event) => setFullName(event.target.value)}
        required
      />
      <Input label="Email" value={email} readOnly />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-brand">{message}</p> : null}
      <Button type="submit" disabled={busy}>
        {busy ? "Menyimpan..." : "Simpan nama"}
      </Button>
    </form>
  );
}

function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok");
      return;
    }

    setBusy(true);
    try {
      await api("/api/profile/password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Kata sandi berhasil diubah.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <PasswordInput
        label="Kata sandi saat ini"
        autoComplete="current-password"
        value={currentPassword}
        onChange={(event) => setCurrentPassword(event.target.value)}
        required
      />
      <PasswordInput
        label="Kata sandi baru"
        autoComplete="new-password"
        value={newPassword}
        onChange={(event) => setNewPassword(event.target.value)}
        required
        minLength={8}
      />
      <PasswordInput
        label="Ulangi kata sandi baru"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        required
        minLength={8}
      />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-brand">{message}</p> : null}
      <Button type="submit" disabled={busy}>
        {busy ? "Menyimpan..." : "Ubah kata sandi"}
      </Button>
    </form>
  );
}
