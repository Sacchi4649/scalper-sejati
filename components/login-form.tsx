"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Input, PasswordInput } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        await api("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password, fullName }),
        });
      } else {
        await api("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
      }
      router.replace("/");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Gagal masuk",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      {mode === "register" ? (
        <Input
          label="Nama lengkap"
          name="fullName"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          required
        />
      ) : null}
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <PasswordInput
        label="Kata sandi"
        name="password"
        autoComplete={mode === "register" ? "new-password" : "current-password"}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <Button type="submit" disabled={loading} className="mt-1 w-full">
        {loading
          ? "Memproses..."
          : mode === "login"
            ? "Masuk"
            : "Buat akun"}
      </Button>
      <button
        type="button"
        className={cn(
          "text-left text-sm leading-6 text-muted", // type
          "underline-offset-4 hover:text-ink hover:underline", // state
        )}
        onClick={() => {
          setMode(mode === "login" ? "register" : "login");
          setError("");
        }}
      >
        {mode === "login"
          ? "Belum punya akun? Daftar. Akun pertama menjadi Super Admin."
          : "Sudah punya akun? Masuk."}
      </button>
    </form>
  );
}
