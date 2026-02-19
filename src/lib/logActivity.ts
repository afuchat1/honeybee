import { supabase } from "@/integrations/supabase/client";

export async function logActivity(
  action: string,
  entityType: string,
  entityId?: string,
  details?: Record<string, any>
) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("activity_logs").insert({
      user_id: user.id,
      action,
      entity_type: entityType,
      entity_id: entityId || null,
      details: details || {},
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}
