'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, ReactNode } from 'react'

export default function QueryProvider({ children }: { children: ReactNode }) {
    // On utilise useState pour éviter de recréer le client à chaque render
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                // Optionnel : évite de refetch quand on change de fenêtre
                refetchOnWindowFocus: false,
                staleTime: 1000 * 60 * 5, // 5 minutes de cache
            },
        },
    }))

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}