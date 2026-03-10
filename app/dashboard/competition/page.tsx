'use client';

import { BarChart3, Gamepad2, Medal, Trophy, Loader2 } from "lucide-react";
import { useTournaments } from "@/lib/hooks/useTournaments";
import { Tournament } from "@/lib/types/database.types";

export default function CompetitionPageList() {
    // Récupération des données réelles
    const { data: tournaments, isLoading, error } = useTournaments();

    // Calcul des stats dynamiques (exemple)
    const activeTournaments = tournaments?.filter(t => t.status === 'live').length || 0;

    const stats = [
        {
            label: 'Compétitions Actives',
            value: isLoading ? '...' : activeTournaments.toString(),
            icon: Trophy,
            color: 'bg-yellow-500/10 text-yellow-400'
        },
        {
            label: 'Total Tournois',
            value: isLoading ? '...' : (tournaments?.length || 0).toString(),
            icon: BarChart3,
            color: 'bg-blue-500/10 text-blue-400'
        },
        {
            label: 'Matchs Joués',
            value: '48', // À connecter plus tard avec useMatches
            icon: Gamepad2,
            color: 'bg-purple-500/10 text-purple-400'
        },
        {
            label: 'Podiums',
            value: '5',
            icon: Medal,
            color: 'bg-emerald-500/10 text-emerald-400'
        },
    ];

    if (error) return <div className="p-6 text-red-500">Erreur lors du chargement...</div>;

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-6">Mes Compétitions</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-[#0f0f12] border border-white/5">
                        <div className={`p-3 rounded-lg ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">{stat.label}</p>
                            <p className="text-xl font-bold">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Liste des tournois réels */}
            <h2 className="text-xl font-semibold mb-4 text-gray-400">Liste des tournois</h2>

            {isLoading ? (
                <div className="flex justify-center p-10">
                    <Loader2 className="animate-spin text-purple-500" size={32} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tournaments?.map((tournament: Tournament) => (
                        <div key={tournament.id} className="p-5 rounded-xl bg-[#0f0f12] border border-white/5 hover:border-purple-500/50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{tournament.name}</h3>
                                    <p className="text-sm text-gray-500">Format: {tournament.format_type}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${tournament.status === 'live' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'
                                    }`}>
                                    {tournament.status}
                                </span>
                            </div>
                            <div className="mt-4 flex items-center justify-between text-sm">
                                <span className="text-gray-400">
                                    {new Date(tournament.start_at).toLocaleDateString('fr-FR')}
                                </span>
                                <button className="text-purple-400 hover:text-purple-300 font-medium">
                                    Voir les détails
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}