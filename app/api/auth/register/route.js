export const runtime = "nodejs";

import { prisma } from "@/lib/server/db";
import { jsonError, jsonOk } from "@/lib/server/api-response";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isValidEmail } from "@/lib/utils";

export async function POST(request) {
  try {
    const body = await request.json();
    const name = body?.name?.trim();
    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;

    if (!name || !email || !password) {
      return jsonError("Name, email, and password are required");
    }

    if (!isValidEmail(email)) {
      return jsonError("Invalid email address");
    }

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      return jsonError(error.message, 400);
    }

    const authUser = data.user;
    if (!authUser) {
      return jsonError("Unable to create user", 400);
    }

    const user = await prisma.user.upsert({
      where: { providerAccountId: authUser.id },
      create: {
        name,
        email,
        authProvider: "credentials",
        providerAccountId: authUser.id,
        emailVerifiedAt: authUser.email_confirmed_at
          ? new Date(authUser.email_confirmed_at)
          : null,
        profile: { create: {} },
        resumes: { create: {} },
      },
      update: {
        name,
        email,
        emailVerifiedAt: authUser.email_confirmed_at
          ? new Date(authUser.email_confirmed_at)
          : null,
      },
      include: { profile: true, resumes: true },
    });

    return jsonOk({ user, authUser });
  } catch (error) {
    return jsonError(error.message || "Unable to register", 500);
  }
}
