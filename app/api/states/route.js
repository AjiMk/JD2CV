export const runtime = "nodejs";

import { jsonError, jsonOk } from "@/lib/server/api-response";
import { prisma } from "@/lib/server/db";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const countryId = searchParams.get("countryId");

    if (!countryId) {
      return jsonOk({ states: [] });
    }

    const states = await prisma.state.findMany({
      where: { countryId },
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    });

    return jsonOk({ states });
  } catch (error) {
    return jsonError(error.message || "Unable to load states", 500);
  }
}
