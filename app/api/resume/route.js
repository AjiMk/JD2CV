export const runtime = "nodejs";

import { jsonError, jsonOk } from "@/lib/server/api-response";
import { prisma } from "@/lib/server/db";
import { getSupabaseUser } from "@/lib/supabase/server";

export async function GET() {
  const authUser = await getSupabaseUser();
  if (!authUser) return jsonError("Unauthorized", 401);

  const user = await prisma.user.findUnique({
    where: { providerAccountId: authUser.id },
  });

  if (!user) return jsonError("Unauthorized", 401);

  const resume = await prisma.resume.findUnique({
    where: { userId: user.id },
    include: { template: true, sections: true, exported: true },
  });

  return jsonOk({ resume });
}

export async function PUT(request) {
  const authUser = await getSupabaseUser();
  if (!authUser) return jsonError("Unauthorized", 401);

  const user = await prisma.user.findUnique({
    where: { providerAccountId: authUser.id },
  });

  if (!user) return jsonError("Unauthorized", 401);

  const body = await request.json();
  const resume = await prisma.resume.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      title: body?.title ?? null,
      status: body?.status ?? "draft",
      templateId: body?.templateId ?? null,
      summary: body?.summary ?? null,
      jobTitle: body?.jobTitle ?? null,
      targetRole: body?.targetRole ?? null,
      atsScore: body?.atsScore ?? null,
      generatedAt: body?.generatedAt ? new Date(body.generatedAt) : null,
    },
    update: {
      title: body?.title ?? null,
      status: body?.status ?? "draft",
      templateId: body?.templateId ?? null,
      summary: body?.summary ?? null,
      jobTitle: body?.jobTitle ?? null,
      targetRole: body?.targetRole ?? null,
      atsScore: body?.atsScore ?? null,
      generatedAt: body?.generatedAt ? new Date(body.generatedAt) : null,
    },
  });

  if (body?.sections) {
    await Promise.all(
      Object.entries(body.sections).map(([type, content]) =>
        prisma.resumeSection.upsert({
          where: {
            resumeId_type: {
              resumeId: resume.id,
              type,
            },
          },
          create: {
            resumeId: resume.id,
            type,
            title: type,
            content,
          },
          update: {
            content,
          },
        }),
      ),
    );
  }

  const savedResume = await prisma.resume.findUnique({
    where: { id: resume.id },
    include: { template: true, sections: true, exported: true },
  });

  return jsonOk({ resume: savedResume });
}
