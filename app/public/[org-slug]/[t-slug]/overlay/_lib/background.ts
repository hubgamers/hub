import type { CSSProperties } from 'react'

export type OverlayBackgroundSearchParams = {
    bg?: string | string[]
    bgDim?: string | string[]
}

function firstParam(value: string | string[] | undefined) {
    if (Array.isArray(value)) return value[0]
    return value
}

function sanitizeBackgroundUrl(raw: string | undefined) {
    if (!raw) return null
    const trimmed = raw.trim()
    if (!trimmed) return null

    if (trimmed.startsWith('/')) {
        return encodeURI(trimmed)
    }

    try {
        const parsed = new URL(trimmed)
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
        return parsed.toString()
    } catch {
        return null
    }
}

function parseDimValue(raw: string | undefined, fallback: number) {
    const parsed = raw ? Number(raw) : Number.NaN
    if (!Number.isFinite(parsed)) return fallback
    const normalized = parsed > 1 ? parsed / 100 : parsed
    return Math.max(0, Math.min(0.9, normalized))
}

export function readOverlayBackgroundConfig(
    searchParams: OverlayBackgroundSearchParams,
    fallbackBackgroundUrl?: string | null
) {
    const requestedBackgroundUrl = sanitizeBackgroundUrl(firstParam(searchParams.bg))
    const fallbackUrl = sanitizeBackgroundUrl(fallbackBackgroundUrl ?? undefined)
    const backgroundUrl = requestedBackgroundUrl ?? fallbackUrl
    const dim = parseDimValue(firstParam(searchParams.bgDim), 0.45)

    return {
        backgroundUrl,
        dim,
    }
}

export function buildOverlayBackgroundStyle(backgroundUrl: string | null, dim: number): CSSProperties | undefined {
    if (!backgroundUrl) return undefined

    return {
        backgroundImage: `linear-gradient(rgba(2, 6, 23, ${dim}), rgba(2, 6, 23, ${dim})), url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
    }
}
