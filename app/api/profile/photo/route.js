export const runtime = "nodejs";

import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
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

function getFileExtension(fileName, mimeType) {
  const lowerName = (fileName || "").toLowerCase();
  if (lowerName.endsWith(".png")) return ".png";
  if (lowerName.endsWith(".webp")) return ".webp";
  if (lowerName.endsWith(".gif")) return ".gif";
  if (lowerName.endsWith(".jpeg")) return ".jpeg";
  if (lowerName.endsWith(".jpg")) return ".jpg";

  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/webp") return ".webp";
  if (mimeType === "image/gif") return ".gif";
  if (mimeType === "image/jpeg") return ".jpg";
  return ".jpg";
}

async function createThumbnailBuffer(fileBuffer) {
  return sharp(fileBuffer)
    .resize(160, 160, {
      fit: "cover",
      position: "center",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 82 })
    .toBuffer();
}

export async function POST(request) {
  try {
    const authUser = await getSupabaseUser();
    if (!authUser) return jsonError("Unauthorized", 401);

    const bucket = process.env.SUPABASE_STORAGE_BUCKET || "profile-photos";
    const supabase = getSupabaseStorageClient();

    const formData = await request.formData();
    const file = formData.get("photo");

    if (!file || typeof file === "string") {
      return jsonError("Photo file is required", 400);
    }

    if (!file.type?.startsWith("image/")) {
      return jsonError("Only image files are allowed", 400);
    }

    const extension = getFileExtension(file.name, file.type);
    const fileId = randomUUID();
    const fileName = `${authUser.id}/${fileId}${extension}`;
    const thumbnailName = `${authUser.id}/${fileId}-thumb.jpg`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const thumbnailBuffer = await createThumbnailBuffer(buffer);
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return jsonError(uploadError.message || "Unable to upload photo", 500);
    }

    const { error: thumbnailError } = await supabase.storage
      .from(bucket)
      .upload(thumbnailName, thumbnailBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (thumbnailError) {
      return jsonError(
        thumbnailError.message || "Unable to create thumbnail",
        500,
      );
    }

    return jsonOk({
      storagePath: fileName,
      thumbnailPath: thumbnailName,
    });
  } catch (error) {
    return jsonError(error.message || "Unable to upload photo", 500);
  }
}
