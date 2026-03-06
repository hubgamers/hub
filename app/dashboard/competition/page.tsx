import { BarChart3, Gamepad2, Medal, Trophy } from "lucide-react";

export default function CompetitionPageList() {
    // Mock data (Idem que ton code original)
    const mockStats = [
        { label: 'Compétitions Actives', value: '3', icon: Trophy, color: 'text-yellow-400' },
        { label: 'XP Gagnée', value: '1,250', icon: BarChart3, color: 'text-blue-400' },
        { label: 'Matchs Joués', value: '48', icon: Gamepad2, color: 'text-purple-400' },
        { label: 'Podiums', value: '5', icon: Medal, color: 'text-emerald-400' },
    ];
    return (
        <div className="min-h-screen bg-[#0a0a0c] text-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">Mes Compétitions</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {mockStats.map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-[#0f0f12] border border-white/5">
                        <div className={`p-3 rounded-lg ${stat.color}`}>
                            <stat.icon size={24} className="text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400">{stat.label}</p>
                            <p className="text-xl font-bold">{stat.value}</p>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    )
}