import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function Dashboard() {

  return (
    <div className="flex h-screen items-center justify-center">
      <h1 className="text-4xl font-bold text-white">Bienvenue sur votre dashboard !</h1>
    </div>
  );
}