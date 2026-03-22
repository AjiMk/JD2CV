export const runtime = "nodejs";

import { jsonError, jsonOk } from "@/lib/server/api-response";
import { prisma } from "@/lib/server/db";
import { getSupabaseUser } from "@/lib/supabase/server";

export async function GET() {
  const authUser = await getSupabaseUser();
  if (!authUser) return jsonError("Unauthorized", 401);

  const profile = await prisma.profile.findUnique({
    where: { user: { providerAccountId: authUser.id } },
    include: { country: true, state: true },
  });

  return jsonOk({ profile });
}

export async function PUT(request) {
  const authUser = await getSupabaseUser();
  if (!authUser) return jsonError("Unauthorized", 401);

  const user = await prisma.user.findUnique({
    where: { providerAccountId: authUser.id },
  });

  if (!user) return jsonError("Unauthorized", 401);

  const body = await request.json();
  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      phone: body?.phone ?? null,
      countryId: body?.countryId ?? null,
      stateId: body?.stateId ?? null,
      pincode: body?.pincode ?? null,
      linkedin: body?.linkedin ?? null,
      github: body?.github ?? null,
      portfolio: body?.portfolio ?? null,
      summary: body?.summary ?? null,
    },
    update: {
      phone: body?.phone ?? null,
      countryId: body?.countryId ?? null,
      stateId: body?.stateId ?? null,
      pincode: body?.pincode ?? null,
      linkedin: body?.linkedin ?? null,
      github: body?.github ?? null,
      portfolio: body?.portfolio ?? null,
      summary: body?.summary ?? null,
    },
  });

  return jsonOk({ profile });
}
