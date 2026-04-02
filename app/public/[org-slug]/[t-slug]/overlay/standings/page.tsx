import { notFound } from 'next/navigation'
import {
    computeGroupOverviews,
    type StandingRow,
    getPublicTournamentBySlugs,
} from '@/lib/actions/tournament/public.queries'
import {
    buildOverlayBackgroundStyle,
    readOverlayBackgroundConfig,
    type OverlayBackgroundSearchParams,
} from '../_lib/background'

type OverlaySearchParams = OverlayBackgroundSearchParams & {
    phaseId?: string | string[]
    mode?: string | string[]
}

type GroupWithStandings = {
    groupIndex: number
    standings: StandingRow[]
}

function firstParam(value: string | string[] | undefined) {
    if (Array.isArray(value)) return value[0]
    return value
}

function buildSelfHref(
    orgSlug: string,
    tournamentSlug: string,
    options: {
        phaseId: string
        mode: 'groups' | 'global'
        bg?: string
        bgDim?: string
    }
) {
    const params = new URLSearchParams()
    params.set('phaseId', options.phaseId)
    params.set('mode', options.mode)
    if (options.bg) params.set('bg', options.bg)
    if (options.bgDim) params.set('bgDim', options.bgDim)
    return `/public/${orgSlug}/${tournamentSlug}/overlay/standings?${params.toString()}`
}

function computeGlobalStandings(groups: GroupWithStandings[]) {
    const rows = groups.flatMap((group) =>
        group.standings.map((row) => ({
            ...row,
            groupIndex: group.groupIndex,
        }))
    )

    return rows.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points
        if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
        if (a.groupIndex !== b.groupIndex) return a.groupIndex - b.groupIndex
        return a.teamName.localeCompare(b.teamName, 'fr', { sensitivity: 'base' })
    })
}

export const dynamic = 'force-dynamic'

export default async function TournamentStandingsOverlayPage({
    params,
    searchParams,
}: {
    params: Promise<{ 'org-slug': string; 't-slug': string }>
    searchParams: Promise<OverlaySearchParams>
}) {
    const { 'org-slug': orgSlug, 't-slug': tournamentSlug } = await params
    const query = await searchParams

    const payload = await getPublicTournamentBySlugs(orgSlug, tournamentSlug)
    if (!payload) notFound()

    const { tournament, matches } = payload
    const groupOverviews = computeGroupOverviews(tournament.registrations, tournament.phases, matches)
    const background = readOverlayBackgroundConfig(query, tournament.bannerUrl)
    const backgroundStyle = buildOverlayBackgroundStyle(background.backgroundUrl, background.dim)

    if (groupOverviews.length === 0) {
        return (
            <main className="min-h-screen bg-transparent text-slate-900" style={backgroundStyle}>
                <div className="mx-auto flex min-h-screen w-full max-w-400 flex-col gap-4 px-4 py-4">
                    <section className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-sm backdrop-blur">
                        <p className="text-xs uppercase tracking-[0.24em] text-teal-700">Overlay classements en direct</p>
                        <div className="mt-2">
                            <h1 className="text-2xl font-black md:text-4xl">{tournament.name}</h1>
                            <p className="mt-1 text-xs text-slate-500 md:text-sm">
                                {tournament.organization.name} · {tournament.game.name}
                            </p>
                        </div>
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white/95 p-8 text-center shadow-sm backdrop-blur">
                        <p className="text-lg font-semibold text-slate-700">Aucune phase de poules configuree.</p>
                        <p className="mt-2 text-sm text-slate-500">
                            Cet overlay s&apos;active des qu&apos;une phase de type poule contient des equipes ou des matchs.
                        </p>
                    </section>
                </div>
            </main>
        )
    }

    const requestedPhaseId = firstParam(query.phaseId)
    const selectedOverview = groupOverviews.find((overview) => overview.phaseId === requestedPhaseId) ?? groupOverviews[0]
    const requestedMode = firstParam(query.mode)
    const mode: 'groups' | 'global' = requestedMode === 'global' ? 'global' : 'groups'
    const globalStandings = computeGlobalStandings(selectedOverview.groups)

    const bg = firstParam(query.bg)
    const bgDim = firstParam(query.bgDim)

    return (
        <main className="min-h-screen bg-transparent text-slate-900" style={backgroundStyle}>
            <div className="mx-auto min-h-screen w-full max-w-450 space-y-4 px-4 py-4">
                <section className="rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-sm backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.24em] text-teal-700">Overlay classements en direct</p>
                    <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h1 className="text-2xl font-black md:text-4xl">{tournament.name}</h1>
                            <p className="mt-1 text-xs text-slate-500 md:text-sm">
                                {selectedOverview.phaseName} · {tournament.organization.name}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-right">
                            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Mode</p>
                            <p className="mt-1 text-xl font-black text-teal-700">
                                {mode === 'groups' ? 'Par poule' : 'Global phase'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {groupOverviews.map((overview) => (
                            <a
                                key={`phase-link-${overview.phaseId}`}
                                href={buildSelfHref(orgSlug, tournamentSlug, {
                                    phaseId: overview.phaseId,
                                    mode,
                                    bg,
                                    bgDim,
                                })}
                                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${overview.phaseId === selectedOverview.phaseId
                                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                                    : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                                    }`}
                            >
                                {overview.phaseName}
                            </a>
                        ))}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                        <a
                            href={buildSelfHref(orgSlug, tournamentSlug, {
                                phaseId: selectedOverview.phaseId,
                                mode: 'groups',
                                bg,
                                bgDim,
                            })}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${mode === 'groups'
                                ? 'border-amber-300 bg-amber-50 text-amber-700'
                                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            Classement par poule
                        </a>
                        <a
                            href={buildSelfHref(orgSlug, tournamentSlug, {
                                phaseId: selectedOverview.phaseId,
                                mode: 'global',
                                bg,
                                bgDim,
                            })}
                            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${mode === 'global'
                                ? 'border-teal-300 bg-teal-50 text-teal-700'
                                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            Classement global phase
                        </a>
                    </div>
                </section>

                {mode === 'groups' ? (
                    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        {selectedOverview.groups.map((group) => (
                            <article key={`group-${selectedOverview.phaseId}-${group.groupIndex}`} className="rounded-xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur">
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-700">Poule {group.groupIndex}</p>

                                {group.standings.length === 0 ? (
                                    <p className="text-xs text-slate-500">Aucune equipe.</p>
                                ) : (
                                    <table className="w-full text-[11px]">
                                        <thead>
                                            <tr className="text-slate-500">
                                                <th className="px-1 py-0.5 text-left">#</th>
                                                <th className="px-1 py-0.5 text-left">Equipe</th>
                                                <th className="px-1 py-0.5 text-right">Pts</th>
                                                <th className="px-1 py-0.5 text-right">J</th>
                                                <th className="px-1 py-0.5 text-right">GD</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {group.standings.map((row, rank) => (
                                                <tr key={row.teamId} className={`border-t border-slate-200 ${rank === 0 ? 'text-amber-800' : 'text-slate-800'}`}>
                                                    <td className="px-1 py-0.5 font-semibold">{rank + 1}</td>
                                                    <td className="max-w-40 truncate px-1 py-0.5">{row.teamName}</td>
                                                    <td className="px-1 py-0.5 text-right font-bold">{row.points}</td>
                                                    <td className="px-1 py-0.5 text-right">{row.played}</td>
                                                    <td className={`px-1 py-0.5 text-right ${row.goalDiff > 0 ? 'text-emerald-700' : row.goalDiff < 0 ? 'text-rose-700' : ''}`}>
                                                        {row.goalDiff > 0 ? '+' : ''}
                                                        {row.goalDiff}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </article>
                        ))}
                    </section>
                ) : (
                    <section className="rounded-xl border border-slate-200 bg-white/95 p-3 shadow-sm backdrop-blur">
                        {globalStandings.length === 0 ? (
                            <p className="text-xs text-slate-500">Aucune equipe classee pour cette phase.</p>
                        ) : (
                            <table className="w-full text-[11px] md:text-sm">
                                <thead>
                                    <tr className="text-slate-500">
                                        <th className="px-2 py-1 text-left">#</th>
                                        <th className="px-2 py-1 text-left">Equipe</th>
                                        <th className="px-2 py-1 text-left">Poule</th>
                                        <th className="px-2 py-1 text-right">Pts</th>
                                        <th className="px-2 py-1 text-right">J</th>
                                        <th className="px-2 py-1 text-right">V</th>
                                        <th className="px-2 py-1 text-right">N</th>
                                        <th className="px-2 py-1 text-right">D</th>
                                        <th className="px-2 py-1 text-right">BP</th>
                                        <th className="px-2 py-1 text-right">BC</th>
                                        <th className="px-2 py-1 text-right">GD</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {globalStandings.map((row, idx) => (
                                        <tr key={`global-${row.teamId}`} className={`border-t border-slate-200 ${idx < 3 ? 'bg-amber-50/70' : ''}`}>
                                            <td className="px-2 py-1 font-semibold">{idx + 1}</td>
                                            <td className="px-2 py-1 font-semibold text-slate-900">{row.teamName}</td>
                                            <td className="px-2 py-1 text-slate-600">{row.groupIndex}</td>
                                            <td className="px-2 py-1 text-right font-black text-teal-700">{row.points}</td>
                                            <td className="px-2 py-1 text-right">{row.played}</td>
                                            <td className="px-2 py-1 text-right">{row.wins}</td>
                                            <td className="px-2 py-1 text-right">{row.draws}</td>
                                            <td className="px-2 py-1 text-right">{row.losses}</td>
                                            <td className="px-2 py-1 text-right">{row.goalsFor}</td>
                                            <td className="px-2 py-1 text-right">{row.goalsAgainst}</td>
                                            <td className={`px-2 py-1 text-right font-semibold ${row.goalDiff > 0 ? 'text-emerald-700' : row.goalDiff < 0 ? 'text-rose-700' : ''}`}>
                                                {row.goalDiff > 0 ? '+' : ''}
                                                {row.goalDiff}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </section>
                )}
            </div>
        </main>
    )
}
