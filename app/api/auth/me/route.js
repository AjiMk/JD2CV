export const runtime = "nodejs";

import { prisma } from "@/lib/server/db";
import { jsonError, jsonOk } from "@/lib/server/api-response";
import { getSupabaseUser } from "@/lib/supabase/server";

export async function GET() {
  const authUser = await getSupabaseUser();
  if (!authUser) {
    return jsonError("Unauthorized", 401);
  }

  const user = await prisma.user.findUnique({
    where: { providerAccountId: authUser.id },
    include: { profile: true, resumes: true },
  });

  if (!user) {
    return jsonError("Unauthorized", 401);
  }

  return jsonOk({ user });
}
