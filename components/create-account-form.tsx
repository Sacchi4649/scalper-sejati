"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";

export function CreateAccountForm({
  endpoint,
  nameLabel,
  submitLabel,
  successMessage,
}: {
  endpoint: string;
  nameLabel: string;
  submitLabel: string;
  successMessage: string;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await api(endpoint, {
        method: "POST",
        body: JSON.stringify({ fullName, email, password }),
      });
      setFullName("");
      setEmail("");
      setPassword("");
      setMessage(successMessage);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Gagal");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Input
        label={nameLabel}
        value={fullName}
        onChange={(event) => setFullName(event.target.value)}
        required
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <PasswordInput
        label="Kata sandi sementara"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-brand">{message}</p> : null}
      <Button type="submit" disabled={busy}>
        {busy ? "Membuat..." : submitLabel}
      </Button>
    </form>
  );
}
