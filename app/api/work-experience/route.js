export const runtime = "nodejs";

import { jsonError, jsonOk } from "@/lib/server/api-response";
import { prisma } from "@/lib/server/db";
import { getSupabaseUser } from "@/lib/supabase/server";

async function getCurrentUser() {
  const authUser = await getSupabaseUser();
  if (!authUser) return null;

  const user = await prisma.user.findUnique({
    where: { providerAccountId: authUser.id },
  });

  return user || null;
}

function toWorkExperiencePayload(entry, sortOrder) {
  return {
    company: entry.company ?? "",
    position: entry.position ?? "",
    countryId: entry.countryId ?? null,
    stateId: entry.stateId ?? null,
    pincode: entry.pincode ?? null,
    startDate: entry.startDate ?? null,
    endDate: entry.endDate ?? null,
    current: Boolean(entry.current),
    achievements: entry.achievements ?? null,
    sortOrder,
  };
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const workExperience = await prisma.workExperienceEntry.findMany({
    where: { userId: user.id },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return jsonOk({ workExperience });
}

export async function PUT(request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const body = await request.json();
  const items = Array.isArray(body?.workExperience) ? body.workExperience : [];

  await prisma.workExperienceEntry.deleteMany({
    where: { userId: user.id },
  });

  if (items.length > 0) {
    await prisma.workExperienceEntry.createMany({
      data: items.map((entry, index) => ({
        userId: user.id,
        ...toWorkExperiencePayload(entry, index),
      })),
    });
  }

  const workExperience = await prisma.workExperienceEntry.findMany({
    where: { userId: user.id },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return jsonOk({ workExperience });
}
