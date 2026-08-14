import { handleApiError, json } from "@/lib/http";
import { deleteManagedAccount } from "@/lib/server/accounts";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteManagedAccount(id, "seller");
    return json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
