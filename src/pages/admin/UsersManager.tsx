import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { logActivity } from "@/lib/logActivity";

interface UserWithRole {
  id: string;
  user_id: string;
  display_name: string | null;
  role: string | null;
  role_id: string | null;
}

const roles = ["admin", "editor", "viewer"];

const UsersManager = () => {
  const { toast } = useToast();
  const { userRole } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);

  const fetchData = async () => {
    const { data: profiles } = await supabase.from("profiles").select("*");
    const { data: roleData } = await supabase.from("user_roles").select("*");

    const merged = (profiles || []).map((p: any) => {
      const r = (roleData || []).find((r: any) => r.user_id === p.user_id);
      return {
        id: p.id,
        user_id: p.user_id,
        display_name: p.display_name,
        role: r?.role || null,
        role_id: r?.id || null,
      };
    });
    setUsers(merged);
  };

  useEffect(() => { fetchData(); }, []);

  const handleRoleChange = async (user: UserWithRole, newRole: string) => {
    if (userRole !== "admin") {
      toast({ title: "Permission denied", description: "Only admins can change roles.", variant: "destructive" });
      return;
    }

    if (user.role_id) {
      await supabase.from("user_roles").update({ role: newRole as any }).eq("id", user.role_id);
    } else {
      await supabase.from("user_roles").insert({ user_id: user.user_id, role: newRole as any });
    }

    await logActivity("role_changed", "user", user.user_id, { new_role: newRole });
    toast({ title: "Role updated" });
    fetchData();
  };

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold text-foreground mb-6">Users & Roles</h1>

      {userRole !== "admin" && (
        <p className="text-sm text-muted-foreground mb-4">Only admins can manage user roles.</p>
      )}

      <div className="bg-background rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-2 font-medium text-muted-foreground">User</th>
              <th className="text-left px-4 py-2 font-medium text-muted-foreground">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 text-foreground">{u.display_name || "Unknown"}</td>
                <td className="px-4 py-3">
                  {userRole === "admin" ? (
                    <select
                      value={u.role || ""}
                      onChange={(e) => handleRoleChange(u, e.target.value)}
                      className="text-sm border border-border rounded-md px-2 py-1 bg-background text-foreground"
                    >
                      <option value="">No role</option>
                      {roles.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="capitalize text-muted-foreground">{u.role || "None"}</span>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={2} className="px-4 py-6 text-center text-muted-foreground">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersManager;
