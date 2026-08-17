import { NextResponse } from "next/server";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function json<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return json({ error: error.message }, error.status);
  }

  if (error instanceof Error && error.message) {
    return json({ error: error.message }, 400);
  }

  return json({ error: "Terjadi kesalahan" }, 500);
}

export async function readJson<T>(request: Request): Promise<T> {
  try {
    return (await request.json()) as T;
  } catch {
    throw new ApiError(400, "Body JSON tidak valid");
  }
}

export function requireFields<T extends Record<string, unknown>>(
  body: T,
  fields: Array<keyof T>,
) {
  for (const field of fields) {
    const value = body[field];
    if (value === undefined || value === null || value === "") {
      throw new ApiError(400, `${String(field)} wajib diisi`);
    }
  }
}

export function parseMoney(value: unknown, label: string) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) {
    throw new ApiError(400, `${label} tidak valid`);
  }
  return amount;
}

export function assertCommissionFitsPrice(price: number, commission: number) {
  if (commission > price) {
    throw new ApiError(400, "Komisi tidak boleh lebih besar dari harga");
  }
}

export function parseQuantity(value: unknown) {
  const quantity = Number(value);
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new ApiError(400, "Jumlah tidak valid");
  }
  return quantity;
}

export function parseStock(value: unknown) {
  const stock = Number(value);
  if (!Number.isInteger(stock) || stock < 1) {
    throw new ApiError(400, "Stok minimal 1");
  }
  return stock;
}

export function parseLanguageId(value: unknown) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, "Kategori bahasa wajib dipilih");
  }
  return id;
}
