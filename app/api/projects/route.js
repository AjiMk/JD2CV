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

function normalizeProjects(projects) {
  if (!Array.isArray(projects)) return [];

  return projects
    .map((project) => ({
      name: typeof project?.name === "string" ? project.name.trim() : "",
      description:
        typeof project?.description === "string"
          ? project.description.trim()
          : "",
      link: typeof project?.link === "string" ? project.link.trim() : "",
      highlights:
        typeof project?.highlights === "string"
          ? project.highlights.trim()
          : "",
      technologies: Array.isArray(project?.technologies)
        ? project.technologies
        : typeof project?.technologies === "string"
          ? project.technologies
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
    }))
    .filter((project) => project.name);
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const projects = await prisma.projectEntry.findMany({
    where: { userId: user.id },
    include: {
      projectSkills: {
        include: {
          skill: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return jsonOk({
    projects: projects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description || "",
      link: project.link || "",
      highlights: project.highlights || "",
      technologies: project.projectSkills
        .map((entry) => entry.skill?.name)
        .filter(Boolean),
    })),
  });
}

export async function PUT(request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const body = await request.json();
  const projects = normalizeProjects(body?.projects);

  await prisma.$transaction(async (tx) => {
    await tx.projectSkill.deleteMany({
      where: {
        project: {
          userId: user.id,
        },
      },
    });

    await tx.projectEntry.deleteMany({
      where: { userId: user.id },
    });

    for (const [index, project] of projects.entries()) {
      const createdProject = await tx.projectEntry.create({
        data: {
          userId: user.id,
          name: project.name,
          description: project.description || null,
          link: project.link || null,
          highlights: project.highlights || null,
          sortOrder: index,
        },
      });

      const uniqueTechnologyNames = [...new Set(project.technologies)];
      if (uniqueTechnologyNames.length === 0) continue;

      const existingSkills = await tx.skill.findMany({
        where: { name: { in: uniqueTechnologyNames } },
      });

      const existingByName = new Map(
        existingSkills.map((skill) => [skill.name, skill]),
      );
      const missingNames = uniqueTechnologyNames.filter(
        (name) => !existingByName.has(name),
      );

      if (missingNames.length > 0) {
        await tx.skill.createMany({
          data: missingNames.map((name) => ({
            name,
            category: "technical",
          })),
        });
      }

      const resolvedSkills = await tx.skill.findMany({
        where: { name: { in: uniqueTechnologyNames } },
      });

      const skillMap = new Map(
        resolvedSkills.map((skill) => [skill.name, skill]),
      );

      await tx.projectSkill.createMany({
        data: uniqueTechnologyNames
          .map((name) => skillMap.get(name)?.id)
          .filter(Boolean)
          .map((skillId) => ({
            projectId: createdProject.id,
            skillId,
          })),
      });
    }
  });

  const savedProjects = await prisma.projectEntry.findMany({
    where: { userId: user.id },
    include: {
      projectSkills: {
        include: {
          skill: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return jsonOk({
    projects: savedProjects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description || "",
      link: project.link || "",
      highlights: project.highlights || "",
      technologies: project.projectSkills
        .map((entry) => entry.skill?.name)
        .filter(Boolean),
    })),
  });
}
