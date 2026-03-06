'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Tournament, TournamentFormat, TournamentStatus } from '@/lib/types/tournament/Tournament';
import { Trophy, Settings2, Calendar, ArrowRight, ArrowLeft, CheckCircle2, Gamepad2 } from 'lucide-react';
import { TOURNAMENT_FORMATS } from '@/lib/types/tournament/TournamentFormat';

export default function CreateTournamentForm({ userId }: { userId: string }) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialisation conforme à ton interface Tournament
    const [formData, setFormData] = useState<Partial<Tournament>>({
        name: '',
        game_name: '',
        start_at: '',
        format_type: 'SINGLE_ELIM',
        status: 'setup' as TournamentStatus,
        max_participants: 16,
        organizer_id: userId,
        format_settings: TOURNAMENT_FORMATS['SINGLE_ELIM'].defaultSettings
    });

    const handleFormatChange = (type: TournamentFormat) => {
        setFormData(prev => ({
            ...prev,
            format_type: type,
            format_settings: TOURNAMENT_FORMATS[type].defaultSettings
        }));
    };

    const updateFormatSettings = (key: keyof Tournament['format_settings'], value: any) => {
        setFormData(prev => ({
            ...prev,
            format_settings: { ...prev.format_settings, [key]: value }
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const { error } = await supabase.from('tournaments').insert([formData]);
            if (error) throw error;
            alert("Compétition créée avec succès !");
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la création");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto bg-[#0f0f12] border border-white/5 rounded-2xl overflow-hidden">
            {/* Progress Bar */}
            <div className="flex h-1.5 bg-white/5">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`flex-1 transition-all ${step >= i ? 'bg-[#5865F2]' : ''}`} />
                ))}
            </div>

            <div className="p-8">
                {/* ÉTAPE 1 : Identité */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-xl font-bold flex items-center gap-2"><Trophy className="text-[#5865F2]" /> Identité du tournoi</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <input
                                placeholder="Nom de la compétition"
                                className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl p-4 outline-none focus:border-[#5865F2]"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                placeholder="Jeu (ex: Valorant)"
                                className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl p-4 outline-none focus:border-[#5865F2]"
                                value={formData.game_name}
                                onChange={e => setFormData({ ...formData, game_name: e.target.value })}
                            />
                            <input
                                type="datetime-local"
                                className="w-full bg-[#1a1a1e] border border-white/10 rounded-xl p-4 outline-none focus:border-[#5865F2]"
                                value={formData.start_at}
                                onChange={e => setFormData({ ...formData, start_at: e.target.value })}
                            />
                        </div>
                    </div>
                )}

                {/* ÉTAPE 2 : Structure (Format) */}
                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-xl font-bold flex items-center gap-2"><Settings2 className="text-[#5865F2]" /> Format de jeu</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {(Object.keys(TOURNAMENT_FORMATS) as TournamentFormat[]).map(type => (
                                <button
                                    key={type}
                                    onClick={() => handleFormatChange(type)}
                                    className={`p-4 rounded-xl border text-left transition-all ${formData.format_type === type ? 'border-[#5865F2] bg-[#5865F2]/10' : 'border-white/5 bg-white/[0.02]'}`}
                                >
                                    <div className="font-bold">{TOURNAMENT_FORMATS[type].name}</div>
                                    <div className="text-xs text-gray-400">{TOURNAMENT_FORMATS[type].description}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ÉTAPE 3 : Réglages Spécifiques (format_settings) */}
                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <h2 className="text-xl font-bold flex items-center gap-2"><CheckCircle2 className="text-[#5865F2]" /> Configuration avancée</h2>
                        <div className="bg-white/[0.02] p-6 rounded-xl border border-white/5 space-y-4">
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold">Participants Max</label>
                                <input
                                    type="number"
                                    className="w-full bg-[#1a1a1e] border border-white/10 rounded-lg p-3 mt-1"
                                    value={formData.max_participants}
                                    onChange={e => setFormData({ ...formData, max_participants: parseInt(e.target.value) })}
                                />
                            </div>

                            {/* Paramètres dynamiques basés sur ton interface Tournament['format_settings'] */}
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                {(formData.format_type === 'POULES' || formData.format_type === 'SWISS') && (
                                    <div>
                                        <label className="text-xs text-gray-500 font-bold">Points / Victoire</label>
                                        <input
                                            type="number"
                                            className="w-full bg-[#1a1a1e] border border-white/10 rounded-lg p-2 mt-1"
                                            value={formData.format_settings?.points_per_win}
                                            onChange={e => updateFormatSettings('points_per_win', parseInt(e.target.value))}
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="text-xs text-gray-500 font-bold">Type de Seed</label>
                                    <select
                                        className="w-full bg-[#1a1a1e] border border-white/10 rounded-lg p-2 mt-1 outline-none"
                                        value={formData.format_settings?.seed_type}
                                        onChange={e => updateFormatSettings('seed_type', e.target.value)}
                                    >
                                        <option value="random">Aléatoire</option>
                                        <option value="skill_based">Basé sur le Skill</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="mt-10 flex justify-between">
                    <button
                        disabled={step === 1}
                        onClick={() => setStep(s => s - 1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white disabled:opacity-0 transition-all"
                    >
                        <ArrowLeft size={20} /> Retour
                    </button>

                    {step < 3 ? (
                        <button
                            onClick={() => setStep(s => s + 1)}
                            className="bg-white text-black px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-200"
                        >
                            Suivant <ArrowRight size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-[#5865F2] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#4752c4] transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Création...' : 'Lancer la compétition'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}