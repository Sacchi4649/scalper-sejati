"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Language } from "@/lib/database.types";
import { api } from "@/lib/api-client";
import { ConfirmDeleteModal } from "@/components/confirm-delete-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LanguageMaster({ languages }: { languages: Language[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Language | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function createLanguage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await api("/api/languages", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      setName("");
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Gagal menambah kategori",
      );
    } finally {
      setBusy(false);
    }
  }

  async function saveLanguage(id: number) {
    setError("");
    setBusy(true);
    try {
      await api(`/api/languages/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name: editingName }),
      });
      setEditingId(null);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Gagal mengubah kategori",
      );
    } finally {
      setBusy(false);
    }
  }

  async function removeLanguage() {
    if (!deleteTarget) return;
    setBusy(true);
    setError("");
    try {
      await api(`/api/languages/${deleteTarget.id}`, { method: "DELETE" });
      setDeleteTarget(null);
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Gagal menghapus kategori",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.2fr)]">
      <form onSubmit={createLanguage} className="grid gap-4">
        <Input
          label="Nama kategori bahasa"
          name="name"
          placeholder="Contoh: English"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        {error && !deleteTarget ? (
          <p className="text-sm text-red-700">{error}</p>
        ) : null}
        <Button type="submit" disabled={busy}>
          {busy ? "Menyimpan..." : "Tambah kategori"}
        </Button>
      </form>
      <div className="divide-y divide-line rounded-2xl border border-line">
        {languages.map((language) => (
          <div
            key={language.id}
            className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            {editingId === language.id ? (
              <Input
                label="Ubah nama"
                value={editingName}
                onChange={(event) => setEditingName(event.target.value)}
              />
            ) : (
              <p className="font-medium">{language.name}</p>
            )}
            <div className="flex flex-wrap gap-2">
              {editingId === language.id ? (
                <>
                  <Button
                    disabled={busy}
                    onClick={() => void saveLanguage(language.id)}
                  >
                    Simpan
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={busy}
                    onClick={() => setEditingId(null)}
                  >
                    Batal
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    disabled={busy}
                    onClick={() => {
                      setEditingId(language.id);
                      setEditingName(language.name);
                      setError("");
                    }}
                  >
                    Ubah
                  </Button>
                  <Button
                    variant="danger"
                    disabled={busy}
                    onClick={() => {
                      setError("");
                      setDeleteTarget(language);
                    }}
                  >
                    Hapus
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
        {languages.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted">
            Belum ada kategori bahasa.
          </p>
        ) : null}
      </div>
      <ConfirmDeleteModal
        open={Boolean(deleteTarget)}
        title={`Hapus ${deleteTarget?.name ?? "kategori"}?`}
        description="Barang yang memakai kategori ini tidak lagi punya kategori bahasa."
        error={error}
        loading={busy}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void removeLanguage()}
      />
    </div>
  );
}
