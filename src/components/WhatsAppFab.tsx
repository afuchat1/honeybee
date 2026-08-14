import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { validateWhatsAppNumber, normalizePhone } from "@/lib/phone";

const DEFAULT_NUMBER = "256758574664";
const DEFAULT_MESSAGE = "Hello Honeybee Ministries, I would like to know more about your work.";

export function WhatsAppFab() {
  const [number, setNumber] = useState(DEFAULT_NUMBER);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("setting_key, setting_value")
      .in("setting_key", ["whatsapp_number", "whatsapp_message"])
      .then(({ data }) => {
        const rows = (data as any[]) || [];
        const rawNum = rows.find((r) => r.setting_key === "whatsapp_number")?.setting_value ?? "";
        const rawMsg = rows.find((r) => r.setting_key === "whatsapp_message")?.setting_value ?? "";
        if (rawNum && !validateWhatsAppNumber(rawNum)) setNumber(normalizePhone(rawNum));
        setMessage(rawMsg || DEFAULT_MESSAGE);
      });
  }, []);

  if (!number) return null;

  const url = new URL(`https://wa.me/${number}`);
  if (message.trim()) url.searchParams.set("text", message.trim());

  return (
    <a
      href={url.toString()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <MessageCircle size={26} strokeWidth={2} />
    </a>
  );
}
