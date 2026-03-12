import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Users2, Building2, Trophy, ArrowRight } from "lucide-react";

export default async function AdminDashboard() {
    const [usersCount, orgsCount, tournamentsCount] = await Promise.all([
        prisma.user.count(),
        prisma.organization.count(),
        prisma.tournament.count(),
    ]);

    return (
        <div className="min-h-screen bg-[#05070a] p-6 md:p-10 text-white">
            <section className="mx-auto max-w-7xl space-y-8">
                <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 md:p-8">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-300/70">Admin SaaS</p>
                    <h1 className="mt-2 text-3xl md:text-5xl font-black tracking-tight">Cockpit administration</h1>
                    <p className="mt-3 max-w-2xl text-slate-400">
                        Surveillez les volumes de votre plateforme et accédez rapidement aux espaces de gestion.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                        <Users2 className="text-cyan-300" size={20} />
                        <p className="mt-3 text-xs uppercase tracking-wider text-slate-400">Utilisateurs</p>
                        <p className="mt-1 text-3xl font-black">{usersCount}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                        <Building2 className="text-indigo-300" size={20} />
                        <p className="mt-3 text-xs uppercase tracking-wider text-slate-400">Organisations</p>
                        <p className="mt-1 text-3xl font-black">{orgsCount}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                        <Trophy className="text-amber-300" size={20} />
                        <p className="mt-3 text-xs uppercase tracking-wider text-slate-400">Tournois</p>
                        <p className="mt-1 text-3xl font-black">{tournamentsCount}</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {[
                        { href: "/admin/users", title: "Gérer les utilisateurs", desc: "Accès, rôles, modération" },
                        { href: "/admin/orgs", title: "Gérer les organisations", desc: "Validation et suivi des structures" },
                        { href: "/admin/tournaments", title: "Gérer les tournois", desc: "Contrôle qualité et support" },
                        { href: "/admin/teams", title: "Gérer les équipes", desc: "Monitoring des équipes actives" },
                        { href: "/admin/games", title: "Gérer les jeux", desc: "Catalogue des jeux disponibles" },
                        { href: "/admin/pitches", title: "Gérer les terrains", desc: "CRUD des pitches par tournoi" },
                        { href: "/admin/settings", title: "Paramètres plateforme", desc: "Navigation, options globales" },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-5 hover:bg-slate-900/70 transition"
                        >
                            <h2 className="text-lg font-bold">{item.title}</h2>
                            <p className="mt-1 text-sm text-slate-400">{item.desc}</p>
                            <span className="mt-4 inline-flex items-center gap-2 text-cyan-300 text-sm">
                                Ouvrir <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                            </span>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}