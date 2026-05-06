import { MatchStatus } from '@prisma/client'
import TabletScoreForm from '@/components/tablet/TabletScoreForm'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

interface TabletPageProps {
  params: Promise<{
    'org-slug': string
    't-slug': string
  }>
}

export default async function TabletPage({ params }: TabletPageProps) {
  const { 'org-slug': orgSlug, 't-slug': tSlug } = await params

  // Fetch tournament with matches
  const tournament = await prisma.tournament.findFirst({
    where: {
      slug: tSlug,
      organization: {
        slug: orgSlug,
      },
    },
    include: {
      phases: {
        include: {
          matches: {
            where: {
              status: {
                in: [MatchStatus.SCHEDULED, MatchStatus.LIVE],
              },
            },
            include: {
              homeTeam: true,
              awayTeam: true,
              pitch: true,
              result: true,
            },
            orderBy: {
              scheduledAt: 'asc',
            },
          },
        },
      },
    },
  })

  if (!tournament) {
    return notFound()
  }

  // Flatten matches
  const matches = tournament.phases.flatMap((p) => p.matches)

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-10 py-4 sm:py-8">

        {/* HEADER */}
        <header className="text-center border-b border-gray-800 pb-4 sm:pb-6 mb-6 sm:mb-10">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-100">
            {tournament.name}
          </h1>
          <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
            Saisie des scores en temps réel
          </p>
        </header>

        {/* CONTENT */}
        <div className="w-full">
          <TabletScoreForm initialMatches={matches} />
        </div>

      </div>
    </div>
  )
}