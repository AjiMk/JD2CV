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

function normalizeCertifications(certifications) {
  if (!Array.isArray(certifications)) return [];

  return certifications
    .map((certification) => ({
      name:
        typeof certification?.name === "string"
          ? certification.name.trim()
          : "",
      issuer:
        typeof certification?.issuer === "string"
          ? certification.issuer.trim()
          : "",
      date:
        typeof certification?.date === "string"
          ? certification.date.trim()
          : "",
      credentialId:
        typeof certification?.credentialId === "string"
          ? certification.credentialId.trim()
          : "",
    }))
    .filter((certification) => certification.name && certification.issuer);
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const certifications = await prisma.certificationEntry.findMany({
    where: { userId: user.id },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return jsonOk({
    certifications: certifications.map((certification) => ({
      id: certification.id,
      name: certification.name,
      issuer: certification.issuer,
      date: certification.date || "",
      credentialId: certification.credentialId || "",
    })),
  });
}

export async function PUT(request) {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);

  const body = await request.json();
  const certifications = normalizeCertifications(body?.certifications);

  await prisma.$transaction(async (tx) => {
    await tx.certificationEntry.deleteMany({
      where: { userId: user.id },
    });

    if (certifications.length > 0) {
      await tx.certificationEntry.createMany({
        data: certifications.map((certification, index) => ({
          userId: user.id,
          name: certification.name,
          issuer: certification.issuer,
          date: certification.date || null,
          credentialId: certification.credentialId || null,
          sortOrder: index,
        })),
      });
    }
  });

  const savedCertifications = await prisma.certificationEntry.findMany({
    where: { userId: user.id },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return jsonOk({
    certifications: savedCertifications.map((certification) => ({
      id: certification.id,
      name: certification.name,
      issuer: certification.issuer,
      date: certification.date || "",
      credentialId: certification.credentialId || "",
    })),
  });
}
