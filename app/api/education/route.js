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

function toEducationPayload(entry, sortOrder) {
  return {
    institution: entry.institution ?? "",
    degree: entry.degree ?? "",
    field: entry.field ?? null,
    startDate: entry.startDate ?? null,
    endDate: entry.endDate ?? null,
    gpa: entry.gpa ?? null,
    achievements: entry.achievements ?? null,
    sortOrder,
  };
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const education = await prisma.educationEntry.findMany({
    where: { userId: user.id },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return jsonOk({ education });
}

export async function PUT(request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const body = await request.json();
  const items = Array.isArray(body?.education) ? body.education : [];

  await prisma.educationEntry.deleteMany({
    where: { userId: user.id },
  });

  if (items.length > 0) {
    await prisma.educationEntry.createMany({
      data: items.map((entry, index) => ({
        userId: user.id,
        ...toEducationPayload(entry, index),
      })),
    });
  }

  const education = await prisma.educationEntry.findMany({
    where: { userId: user.id },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return jsonOk({ education });
}
