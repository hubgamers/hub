import Link from "next/link";
import { getOrganizationBySlug } from "@/lib/actions/organization/organization.queries";
import { Users2, Shield, UserPlus } from "lucide-react";

export default async function DashboardOrgMembers({
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
                    <h1 className="text-2xl md:text-3xl font-black">Membres de l&apos;organisation</h1>
                </div>
                <Link href={`/dashboard/org/${slug}/members/invite`} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold hover:bg-indigo-500 transition">
                    <UserPlus size={16} /> Inviter un membre
                </Link>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                <div className="mb-4 flex items-center gap-2 text-slate-300">
                    <Users2 size={18} />
                    <span>{org.members.length} membre(s)</span>
                </div>

                <div className="space-y-3">
                    {org.members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                            <div>
                                <p className="font-semibold">{member.user.display_name || member.user.username || "Utilisateur"}</p>
                                <p className="text-xs text-slate-400">@{member.user.username || "profil"}</p>
                            </div>
                            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 text-[10px] font-semibold uppercase text-cyan-300">
                                <Shield size={12} /> {member.role}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}