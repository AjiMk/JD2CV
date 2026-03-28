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

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const [skills, userSkills] = await Promise.all([
    prisma.skill.findMany({
      orderBy: [{ category: "asc" }, { name: "asc" }],
    }),
    prisma.userSkill.findMany({
      where: { userId: user.id },
      include: { skill: true },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
    }),
  ]);

  return jsonOk({ skills, userSkills });
}

export async function PUT(request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const body = await request.json();
  const technical = Array.isArray(body?.technical) ? body.technical : [];
  const soft = Array.isArray(body?.soft) ? body.soft : [];

  const allSkillNames = [...technical, ...soft]
    .map((name) => (typeof name === "string" ? name.trim() : ""))
    .filter(Boolean);

  const uniqueNames = [...new Set(allSkillNames)];

  const existingSkills = await prisma.skill.findMany({
    where: { name: { in: uniqueNames } },
  });

  const existingByName = new Map(
    existingSkills.map((skill) => [skill.name, skill]),
  );
  const missingNames = uniqueNames.filter((name) => !existingByName.has(name));

  if (missingNames.length > 0) {
    await prisma.skill.createMany({
      data: missingNames.map((name) => ({
        name,
        category: technical.includes(name) ? "technical" : "soft",
      })),
    });
  }

  const resolvedSkills = await prisma.skill.findMany({
    where: { name: { in: uniqueNames } },
  });

  const skillMap = new Map(resolvedSkills.map((skill) => [skill.name, skill]));

  await prisma.userSkill.deleteMany({
    where: { userId: user.id },
  });

  const entries = [
    ...technical.map((name, index) => ({
      userId: user.id,
      skillId: skillMap.get(name.trim())?.id,
      category: "technical",
      sortOrder: index,
    })),
    ...soft.map((name, index) => ({
      userId: user.id,
      skillId: skillMap.get(name.trim())?.id,
      category: "soft",
      sortOrder: index,
    })),
  ].filter((entry) => entry.skillId);

  if (entries.length > 0) {
    await prisma.userSkill.createMany({
      data: entries,
    });
  }

  const userSkills = await prisma.userSkill.findMany({
    where: { userId: user.id },
    include: { skill: true },
    orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
  });

  return jsonOk({ userSkills });
}
