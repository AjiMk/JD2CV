import { jsonError, jsonOk } from "@/lib/server/api-response";
import { prisma } from "@/lib/server/db";
import { getSupabaseUser } from "@/lib/supabase/server";

export async function GET(_request, { params }) {
  const authUser = await getSupabaseUser();
  if (!authUser) return jsonError("Unauthorized", 401);

  const user = await prisma.user.findUnique({
    where: { providerAccountId: authUser.id },
  });

  if (!user) return jsonError("Unauthorized", 401);

  const jobApplication = await prisma.jobApplication.findFirst({
    where: { id: params.id, userId: user.id },
    include: { company: true, country: true, state: true, stageHistory: true },
  });

  if (!jobApplication) return jsonError("Not found", 404);
  return jsonOk({ jobApplication });
}

export async function PUT(request, { params }) {
  const authUser = await getSupabaseUser();
  if (!authUser) return jsonError("Unauthorized", 401);

  const user = await prisma.user.findUnique({
    where: { providerAccountId: authUser.id },
  });

  if (!user) return jsonError("Unauthorized", 401);

  const body = await request.json();
  const existing = await prisma.jobApplication.findFirst({
    where: { id: params.id, userId: user.id },
  });

  if (!existing) return jsonError("Not found", 404);

  const stageChanged = body?.stage && body.stage !== existing.stage;

  const jobApplication = await prisma.jobApplication.update({
    where: { id: params.id },
    data: {
      companyId: body?.companyId ?? null,
      manualCompanyName: body?.manualCompanyName ?? null,
      role: body?.role ?? existing.role,
      stage: body?.stage ?? existing.stage,
      appliedDate: body?.appliedDate
        ? new Date(body.appliedDate)
        : existing.appliedDate,
      interviewDate: body?.interviewDate
        ? new Date(body.interviewDate)
        : existing.interviewDate,
      countryId: body?.countryId ?? null,
      stateId: body?.stateId ?? null,
      pincode: body?.pincode ?? null,
      salary: body?.salary ?? null,
      source: body?.source ?? null,
      notes: body?.notes ?? null,
      stageHistory: stageChanged
        ? {
            create: {
              stage: body.stage,
              note: body?.notes ?? null,
            },
          }
        : undefined,
    },
    include: { company: true, country: true, state: true, stageHistory: true },
  });

  return jsonOk({ jobApplication });
}

export async function DELETE(_request, { params }) {
  const authUser = await getSupabaseUser();
  if (!authUser) return jsonError("Unauthorized", 401);

  const user = await prisma.user.findUnique({
    where: { providerAccountId: authUser.id },
  });

  if (!user) return jsonError("Unauthorized", 401);

  const existing = await prisma.jobApplication.findFirst({
    where: { id: params.id, userId: user.id },
  });

  if (!existing) return jsonError("Not found", 404);

  await prisma.jobApplication.delete({ where: { id: params.id } });
  return jsonOk({ success: true });
}
