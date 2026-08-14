import { ApiError, handleApiError, json, readJson } from "@/lib/http";
import { requireApiRole } from "@/lib/server/session";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

type ReviewBody = {
  status?: "approved" | "rejected";
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireApiRole("super_admin");
    const { id } = await context.params;
    const body = await readJson<ReviewBody>(request);

    if (body.status !== "approved" && body.status !== "rejected") {
      throw new ApiError(400, "Status tinjauan tidak valid");
    }

    const supabase = await createClient();
    const { error } = await supabase.rpc("review_commission_request", {
      request_id: Number(id),
      next_status: body.status,
    });

    if (error) {
      throw new ApiError(400, error.message);
    }

    return json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
