export const runtime = "nodejs";

import { jsonError, jsonOk } from "@/lib/server/api-response";
import { prisma } from "@/lib/server/db";
import { getSupabaseUser } from "@/lib/supabase/server";

export async function GET(request) {
  const authUser = await getSupabaseUser();
  if (!authUser) return jsonError("Unauthorized", 401);

  const user = await prisma.user.findUnique({
    where: { providerAccountId: authUser.id },
  });

  if (!user) return jsonError("Unauthorized", 401);

  const { searchParams } = new URL(request.url);
  const stage = searchParams.get("stage");
  const page = Math.max(Number(searchParams.get("page") || 1), 1);
  const limit = Math.min(
    Math.max(Number(searchParams.get("limit") || 10), 1),
    100,
  );

  const where = { userId: user.id, ...(stage ? { stage } : {}) };
  const [items, total] = await Promise.all([
    prisma.jobApplication.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        company: true,
        country: true,
        state: true,
        stageHistory: true,
      },
    }),
    prisma.jobApplication.count({ where }),
  ]);

  return jsonOk({ items, total, page, limit });
}

export async function POST(request) {
  const authUser = await getSupabaseUser();
  if (!authUser) return jsonError("Unauthorized", 401);

  const user = await prisma.user.findUnique({
    where: { providerAccountId: authUser.id },
  });

  if (!user) return jsonError("Unauthorized", 401);

  const body = await request.json();
  if (!body?.role) return jsonError("Role is required");

  const jobApplication = await prisma.jobApplication.create({
    data: {
      userId: user.id,
      companyId: body?.companyId ?? null,
      manualCompanyName: body?.manualCompanyName ?? null,
      role: body.role,
      stage: body?.stage ?? "applied",
      appliedDate: body?.appliedDate ? new Date(body.appliedDate) : null,
      interviewDate: body?.interviewDate ? new Date(body.interviewDate) : null,
      countryId: body?.countryId ?? null,
      stateId: body?.stateId ?? null,
      pincode: body?.pincode ?? null,
      salary: body?.salary ?? null,
      source: body?.source ?? null,
      notes: body?.notes ?? null,
      stageHistory: {
        create: {
          stage: body?.stage ?? "applied",
          note: body?.notes ?? null,
        },
      },
    },
    include: { company: true, country: true, state: true, stageHistory: true },
  });

  return jsonOk({ jobApplication }, 201);
}
