export const runtime = "nodejs";

import { jsonError, jsonOk } from "@/lib/server/api-response";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isValidEmail } from "@/lib/utils";
import { prisma } from "@/lib/server/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;

    if (!email || !password) {
      return jsonError("Email and password are required");
    }

    if (!isValidEmail(email)) {
      return jsonError("Invalid email address");
    }

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data?.user) {
      await prisma.loginAttempt.create({
        data: { email, success: false, reason: "invalid_credentials" },
      });
      return jsonError(error?.message || "Invalid credentials", 401);
    }

    const authUser = data.user;
    const user = await prisma.user.upsert({
      where: { providerAccountId: authUser.id },
      create: {
        name:
          authUser.user_metadata?.name ||
          authUser.email?.split("@")[0] ||
          "User",
        email: authUser.email,
        authProvider: "credentials",
        providerAccountId: authUser.id,
        emailVerifiedAt: authUser.email_confirmed_at
          ? new Date(authUser.email_confirmed_at)
          : null,
        profile: { create: {} },
        resumes: { create: {} },
      },
      update: {
        name:
          authUser.user_metadata?.name ||
          authUser.email?.split("@")[0] ||
          "User",
        email: authUser.email,
        emailVerifiedAt: authUser.email_confirmed_at
          ? new Date(authUser.email_confirmed_at)
          : null,
      },
      include: { profile: true, resumes: true },
    });

    await prisma.loginAttempt.create({
      data: { userId: user.id, email, success: true },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return jsonOk({ user });
  } catch (error) {
    return jsonError(error.message || "Unable to login", 500);
  }
}
