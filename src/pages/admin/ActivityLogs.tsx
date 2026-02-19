import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LogEntry {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: any;
  created_at: string;
}

const ActivityLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      setLogs((data as LogEntry[]) || []);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-foreground mb-6">Activity Logs</h1>

      <div className="bg-background rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-2 font-medium text-muted-foreground">Date</th>
                <th className="text-left px-4 py-2 font-medium text-muted-foreground">Action</th>
                <th className="text-left px-4 py-2 font-medium text-muted-foreground">Entity</th>
                <th className="text-left px-4 py-2 font-medium text-muted-foreground hidden md:table-cell">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-2.5 text-muted-foreground text-xs whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 text-foreground capitalize">{log.action}</td>
                  <td className="px-4 py-2.5 text-muted-foreground capitalize">{log.entity_type}</td>
                  <td className="px-4 py-2.5 text-muted-foreground text-xs hidden md:table-cell max-w-xs truncate">
                    {log.details && Object.keys(log.details).length > 0
                      ? JSON.stringify(log.details)
                      : "—"}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">No activity logged yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
