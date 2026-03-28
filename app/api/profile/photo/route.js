export const runtime = "nodejs";

import path from "path";
import fs from "fs/promises";
import { randomUUID } from "crypto";
import { jsonError, jsonOk } from "@/lib/server/api-response";
import { getSupabaseUser } from "@/lib/supabase/server";

const UPLOAD_DIR = path.join(
  process.cwd(),
  "public",
  "uploads",
  "profile-photos",
);

async function ensureUploadDir() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

function getFileExtension(fileName, mimeType) {
  const ext = path.extname(fileName || "").toLowerCase();
  if (ext) return ext;

  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/webp") return ".webp";
  if (mimeType === "image/gif") return ".gif";
  return ".jpg";
}

export async function POST(request) {
  try {
    const authUser = await getSupabaseUser();
    if (!authUser) return jsonError("Unauthorized", 401);

    const formData = await request.formData();
    const file = formData.get("photo");

    if (!file || typeof file === "string") {
      return jsonError("Photo file is required", 400);
    }

    if (!file.type?.startsWith("image/")) {
      return jsonError("Only image files are allowed", 400);
    }

    await ensureUploadDir();

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = getFileExtension(file.name, file.type);
    const fileName = `${authUser.id}-${randomUUID()}${extension}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    await fs.writeFile(filePath, buffer);

    return jsonOk({
      photoUrl: `/uploads/profile-photos/${fileName}`,
    });
  } catch (error) {
    return jsonError(error.message || "Unable to upload photo", 500);
  }
}
