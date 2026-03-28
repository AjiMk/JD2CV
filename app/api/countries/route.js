export const runtime = "nodejs";

import { jsonError, jsonOk } from "@/lib/server/api-response";
import { prisma } from "@/lib/server/db";

export async function GET() {
  try {
    const countries = await prisma.country.findMany({
      select: { id: true, name: true, code: true },
      orderBy: { name: "asc" },
    });

    return jsonOk({ countries });
  } catch (error) {
    return jsonError(error.message || "Unable to load countries", 500);
  }
}
