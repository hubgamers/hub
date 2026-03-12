"use client";
import OrganizationList from "@/components/dashboard/OrganizationList";
import Link from "next/link";
import { Building2, Plus, Trophy } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#05070a] p-6 md:p-10 text-white">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/70">HubGamers Control Room</p>
              <h1 className="mt-2 text-3xl md:text-5xl font-black tracking-tight">Pilotez vos organisations et compétitions</h1>
              <p className="mt-3 max-w-2xl text-slate-400">
                Centralisez vos structures, suivez vos équipes, et accédez rapidement aux actions essentielles de votre SaaS esport.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
              <Link href="/dashboard/org/create" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold hover:bg-indigo-500 transition">
                <Plus size={16} /> Nouvelle org
              </Link>
              <Link href="/dashboard/orgs" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold hover:border-slate-500 hover:bg-slate-900/60 transition">
                <Building2 size={16} /> Mes orgs
              </Link>
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold hover:border-slate-500 hover:bg-slate-900/60 transition">
                <Trophy size={16} /> Vue tournois
              </Link>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 md:p-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Espace organisations</h2>
            <Link href="/dashboard/org/create" className="text-sm text-cyan-300 hover:text-cyan-200">Créer maintenant</Link>
          </div>
          <section>
            <OrganizationList />
          </section>
        </div>
      </section>
    </div>
  );
}