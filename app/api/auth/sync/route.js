export const runtime = "nodejs";

import { jsonError, jsonOk } from "@/lib/server/api-response";
import { prisma } from "@/lib/server/db";
import { getSupabaseUser } from "@/lib/supabase/server";

export async function POST() {
  const authUser = await getSupabaseUser();

  if (!authUser) {
    return jsonError("Unauthorized", 401);
  }

  const user = await prisma.user.upsert({
    where: { providerAccountId: authUser.id },
    create: {
      name:
        authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
      email: authUser.email,
      authProvider: "credentials",
      providerAccountId: authUser.id,
      emailVerifiedAt: authUser.email_confirmed_at
        ? new Date(authUser.email_confirmed_at)
        : null,
      profile: { create: {} },
      resumes: { create: {} },
    },
    update: {
      name:
        authUser.user_metadata?.name || authUser.email?.split("@")[0] || "User",
      email: authUser.email,
      emailVerifiedAt: authUser.email_confirmed_at
        ? new Date(authUser.email_confirmed_at)
        : null,
    },
    include: { profile: true, resumes: true },
  });

  return jsonOk({ user });
}
