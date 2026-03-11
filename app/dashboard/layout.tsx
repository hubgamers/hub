import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClientShell from "./DashboardClientShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  // Sécurité : Si pas de session, on dégage vers le login
  if (error || !user) {
    redirect("/login");
  }

  // On prépare les données utilisateur pour le client
  const userData = {
    name: user.user_metadata.full_name || "Utilisateur",
    email: user.email,
    avatar: user.user_metadata.avatar_url
  };

  console.log(userData)

  return (
    <DashboardClientShell user={userData}>
      {children}
    </DashboardClientShell>
  );
}