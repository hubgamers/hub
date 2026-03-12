import Link from "next/link";
import { getOrganizationBySlug } from "@/lib/actions/organization/organization.queries";
import { Users2, Plus } from "lucide-react";

export default async function DashboardOrgTeams({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const org = await getOrganizationBySlug(slug);

    if (!org) {
        return <div className="text-slate-300">Organisation introuvable.</div>;
    }

    return (
        <div className="space-y-6 text-white">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400">{org.name}</p>
                    <h1 className="text-2xl md:text-3xl font-black">Équipes de l&apos;organisation</h1>
                </div>
                <Link href={`/dashboard/org/${slug}/teams/create`} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold hover:bg-indigo-500 transition">
                    <Plus size={16} /> Créer une équipe
                </Link>
            </div>

            {org.teams.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-8 text-center text-slate-400">
                    Aucune équipe pour le moment.
                </div>
            ) : (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {org.teams.map((team) => (
                        <div key={team.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                            <div className="mb-2 flex items-center gap-2 text-cyan-300">
                                <Users2 size={16} />
                                <span className="text-xs uppercase">Team</span>
                            </div>
                            <p className="text-lg font-bold">{team.name}</p>
                            <p className="text-xs text-slate-400 mt-1">/{team.slug}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}