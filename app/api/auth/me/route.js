export const runtime = "nodejs";

import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/server/db";
import { jsonError, jsonOk } from "@/lib/server/api-response";
import { getSupabaseUser } from "@/lib/supabase/server";

function getSupabaseStorageClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase storage environment variables are missing");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function GET() {
  const authUser = await getSupabaseUser();
  if (!authUser) {
    return jsonError("Unauthorized", 401);
  }

  const user = await prisma.user.findUnique({
    where: { providerAccountId: authUser.id },
    include: { profile: true, resumes: true },
  });

  if (!user) {
    return jsonError("Unauthorized", 401);
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "profile-photos";
  const profile = user.profile
    ? {
        ...user.profile,
        photoPath: user.profile.photoUrl || null,
        photoThumbnailPath: user.profile.photoThumbnailUrl || null,
        photoUrl: user.profile.photoUrl || null,
      }
    : user.profile;

  if (profile?.photoThumbnailPath || profile?.photoPath) {
    const supabase = getSupabaseStorageClient();
    const thumbnailPath = profile.photoThumbnailPath || profile.photoPath;
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(thumbnailPath, 60 * 60);

    if (!error && data?.signedUrl) {
      profile.photoUrl = data.signedUrl;
      profile.photoThumbnailUrl = data.signedUrl;
    }
  }

  return jsonOk({
    user: {
      ...user,
      profile,
    },
  });
}
