import { jsonOk } from "@/lib/server/api-response";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  return jsonOk({ success: true });
}
