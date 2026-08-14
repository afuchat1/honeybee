import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_NUMBER = "256758574664";

export function WhatsAppFab() {
  const [number, setNumber] = useState(DEFAULT_NUMBER);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("setting_value")
      .eq("setting_key", "whatsapp_number")
      .maybeSingle()
      .then(({ data }) => {
        const val = (data as any)?.setting_value?.replace(/[^0-9]/g, "");
        if (val) setNumber(val);
      });
  }, []);

  if (!number) return null;

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <MessageCircle size={26} strokeWidth={2} />
    </a>
  );
}
