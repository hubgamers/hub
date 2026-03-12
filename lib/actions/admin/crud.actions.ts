'use server'

import { prisma } from '@/lib/prisma'
import { getAuthUser } from '../utils.actions'
import { NavigationContext, OrgType, Role, TournamentStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

async function assertAdmin() {
  const authUser = await getAuthUser()
  const dbUser = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { roles: true },
  })

  if (!dbUser?.roles.includes(Role.ADMIN)) {
    throw new Error('Acces refuse: role ADMIN requis')
  }
}

function normalizeOptional(value: FormDataEntryValue | null) {
  if (!value) return null
  const text = String(value).trim()
  return text.length ? text : null
}

export async function createAdminUser(formData: FormData) {
  await assertAdmin()

  const username = String(formData.get('username') || '').trim()
  const displayName = String(formData.get('display_name') || '').trim()
  const country = normalizeOptional(formData.get('country'))
  const role = (String(formData.get('role') || 'USER') as Role)

  if (!username || !displayName) return

  await prisma.user.create({
    data: {
      username,
      display_name: displayName,
      country,
      roles: [role],
    },
  })

  revalidatePath('/admin/users')
}

export async function updateAdminUser(formData: FormData) {
  await assertAdmin()

  const id = String(formData.get('id') || '')
  const displayName = String(formData.get('display_name') || '').trim()
  const country = normalizeOptional(formData.get('country'))
  const role = (String(formData.get('role') || 'USER') as Role)

  if (!id || !displayName) return

  await prisma.user.update({
    where: { id },
    data: {
      display_name: displayName,
      country,
      roles: [role],
    },
  })

  revalidatePath('/admin/users')
}

export async function deleteAdminUser(formData: FormData) {
  await assertAdmin()

  const id = String(formData.get('id') || '')
  if (!id) return

  await prisma.user.delete({ where: { id } })
  revalidatePath('/admin/users')
}

export async function createAdminOrganization(formData: FormData) {
  await assertAdmin()

  const name = String(formData.get('name') || '').trim()
  const slug = String(formData.get('slug') || '').trim()
  const ownerId = String(formData.get('ownerId') || '').trim()
  const type = (String(formData.get('type') || 'MIXED') as OrgType)
  const logoUrl = normalizeOptional(formData.get('logoUrl'))

  if (!name || !slug || !ownerId) return

  await prisma.organization.create({
    data: {
      name,
      slug,
      type,
      logoUrl,
      ownerId,
    },
  })

  revalidatePath('/admin/orgs')
}

export async function updateAdminOrganization(formData: FormData) {
  await assertAdmin()

  const id = String(formData.get('id') || '')
  const name = String(formData.get('name') || '').trim()
  const slug = String(formData.get('slug') || '').trim()
  const ownerId = String(formData.get('ownerId') || '').trim()
  const type = (String(formData.get('type') || 'MIXED') as OrgType)
  const logoUrl = normalizeOptional(formData.get('logoUrl'))

  if (!id || !name || !slug || !ownerId) return

  await prisma.organization.update({
    where: { id },
    data: {
      name,
      slug,
      ownerId,
      type,
      logoUrl,
    },
  })

  revalidatePath('/admin/orgs')
}

export async function deleteAdminOrganization(formData: FormData) {
  await assertAdmin()
  const id = String(formData.get('id') || '')
  if (!id) return

  await prisma.organization.delete({ where: { id } })
  revalidatePath('/admin/orgs')
}

export async function createAdminTeam(formData: FormData) {
  await assertAdmin()

  const name = String(formData.get('name') || '').trim()
  const slug = String(formData.get('slug') || '').trim()
  const organizationId = String(formData.get('organizationId') || '').trim()
  const logoUrl = normalizeOptional(formData.get('logoUrl'))

  if (!name || !slug || !organizationId) return

  await prisma.team.create({
    data: {
      name,
      slug,
      organizationId,
      logoUrl,
    },
  })

  revalidatePath('/admin/teams')
}

export async function updateAdminTeam(formData: FormData) {
  await assertAdmin()

  const id = String(formData.get('id') || '')
  const name = String(formData.get('name') || '').trim()
  const slug = String(formData.get('slug') || '').trim()
  const organizationId = String(formData.get('organizationId') || '').trim()
  const logoUrl = normalizeOptional(formData.get('logoUrl'))

  if (!id || !name || !slug || !organizationId) return

  await prisma.team.update({
    where: { id },
    data: {
      name,
      slug,
      organizationId,
      logoUrl,
    },
  })

  revalidatePath('/admin/teams')
}

export async function deleteAdminTeam(formData: FormData) {
  await assertAdmin()
  const id = String(formData.get('id') || '')
  if (!id) return

  await prisma.team.delete({ where: { id } })
  revalidatePath('/admin/teams')
}

export async function createAdminTournament(formData: FormData) {
  await assertAdmin()

  const name = String(formData.get('name') || '').trim()
  const slug = String(formData.get('slug') || '').trim()
  const organizationId = String(formData.get('organizationId') || '').trim()
  const gameId = String(formData.get('gameId') || '').trim()
  const status = (String(formData.get('status') || 'DRAFT') as TournamentStatus)
  const description = normalizeOptional(formData.get('description'))

  if (!name || !slug || !organizationId || !gameId) return

  await prisma.tournament.create({
    data: {
      name,
      slug,
      organizationId,
      gameId,
      status,
      description,
    },
  })

  revalidatePath('/admin/tournaments')
}

export async function updateAdminTournament(formData: FormData) {
  await assertAdmin()

  const id = String(formData.get('id') || '')
  const name = String(formData.get('name') || '').trim()
  const slug = String(formData.get('slug') || '').trim()
  const organizationId = String(formData.get('organizationId') || '').trim()
  const gameId = String(formData.get('gameId') || '').trim()
  const status = (String(formData.get('status') || 'DRAFT') as TournamentStatus)
  const description = normalizeOptional(formData.get('description'))

  if (!id || !name || !slug || !organizationId || !gameId) return

  await prisma.tournament.update({
    where: { id },
    data: {
      name,
      slug,
      organizationId,
      gameId,
      status,
      description,
    },
  })

  revalidatePath('/admin/tournaments')
}

export async function deleteAdminTournament(formData: FormData) {
  await assertAdmin()
  const id = String(formData.get('id') || '')
  if (!id) return

  await prisma.tournament.delete({ where: { id } })
  revalidatePath('/admin/tournaments')
}

export async function createAdminGame(formData: FormData) {
  await assertAdmin()

  const name = String(formData.get('name') || '').trim()
  const logoUrl = normalizeOptional(formData.get('logoUrl'))
  if (!name) return

  await prisma.game.create({
    data: {
      name,
      logoUrl,
    },
  })

  revalidatePath('/admin/games')
}

export async function updateAdminGame(formData: FormData) {
  await assertAdmin()

  const id = String(formData.get('id') || '')
  const name = String(formData.get('name') || '').trim()
  const logoUrl = normalizeOptional(formData.get('logoUrl'))

  if (!id || !name) return

  await prisma.game.update({
    where: { id },
    data: {
      name,
      logoUrl,
    },
  })

  revalidatePath('/admin/games')
}

export async function deleteAdminGame(formData: FormData) {
  await assertAdmin()
  const id = String(formData.get('id') || '')
  if (!id) return

  await prisma.game.delete({ where: { id } })
  revalidatePath('/admin/games')
}

export async function createAdminPitch(formData: FormData) {
  await assertAdmin()

  const name = String(formData.get('name') || '').trim()
  const tournamentId = String(formData.get('tournamentId') || '').trim()
  const phaseId = normalizeOptional(formData.get('phaseId'))

  if (!name || !tournamentId) return

  await prisma.pitch.create({
    data: {
      name,
      tournamentId,
      phaseId,
    },
  })

  revalidatePath('/admin/pitches')
}

export async function updateAdminPitch(formData: FormData) {
  await assertAdmin()

  const id = String(formData.get('id') || '')
  const name = String(formData.get('name') || '').trim()
  const tournamentId = String(formData.get('tournamentId') || '').trim()
  const phaseId = normalizeOptional(formData.get('phaseId'))

  if (!id || !name || !tournamentId) return

  await prisma.pitch.update({
    where: { id },
    data: {
      name,
      tournamentId,
      phaseId,
    },
  })

  revalidatePath('/admin/pitches')
}

export async function deleteAdminPitch(formData: FormData) {
  await assertAdmin()
  const id = String(formData.get('id') || '')
  if (!id) return

  await prisma.pitch.delete({ where: { id } })
  revalidatePath('/admin/pitches')
}

export async function createAdminNavItem(formData: FormData) {
  await assertAdmin()

  const name = String(formData.get('name') || '').trim()
  const label = String(formData.get('label') || '').trim()
  const href = String(formData.get('href') || '').trim()
  const icon = normalizeOptional(formData.get('icon'))
  const order = Number(formData.get('order') || 0)
  const context = String(formData.get('context') || NavigationContext.USER_DASHBOARD) as NavigationContext
  const requiredRole = normalizeOptional(formData.get('requiredRole'))

  if (!name || !label || !href) return

  await prisma.navigationItem.create({
    data: {
      name,
      label,
      href,
      icon,
      order,
      context,
      requiredRole,
    },
  })

  revalidatePath('/admin/settings')
}

export async function updateAdminNavItem(formData: FormData) {
  await assertAdmin()

  const id = String(formData.get('id') || '')
  const label = String(formData.get('label') || '').trim()
  const href = String(formData.get('href') || '').trim()
  const icon = normalizeOptional(formData.get('icon'))
  const order = Number(formData.get('order') || 0)
  const context = String(formData.get('context') || NavigationContext.USER_DASHBOARD) as NavigationContext
  const requiredRole = normalizeOptional(formData.get('requiredRole'))
  const isActive = String(formData.get('isActive') || 'true') === 'true'

  if (!id || !label || !href) return

  await prisma.navigationItem.update({
    where: { id },
    data: {
      label,
      href,
      icon,
      order,
      context,
      requiredRole,
      isActive,
    },
  })

  revalidatePath('/admin/settings')
}

export async function deleteAdminNavItem(formData: FormData) {
  await assertAdmin()
  const id = String(formData.get('id') || '')
  if (!id) return

  await prisma.navigationItem.delete({ where: { id } })
  revalidatePath('/admin/settings')
}
