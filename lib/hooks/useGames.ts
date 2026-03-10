// hooks/use-games.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Game, GameInsert } from '@/lib/types/database.types'
import { supabase } from '../supabase'

// 1. Hook pour récupérer tous les jeux
export function useGames() {
    return useQuery({
        queryKey: ['games'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('games')
                .select('*')
                .order('name')

            if (error) throw error
            return data as Game[]
        },
    })
}

// 2. Hook pour récupérer un seul jeu par son slug
export function useGame(slug: string) {
    return useQuery({
        queryKey: ['games', slug],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('games')
                .select('*')
                .eq('slug', slug)
                .single()

            if (error) throw error
            return data as Game
        },
        enabled: !!slug,
    })
}

// 3. Hook pour créer un jeu (Mutation)
export function useCreateGame() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (newGame: GameInsert) => {
            const { data, error } = await supabase
                .from('games')
                .insert(newGame)
                .select()
                .single()

            if (error) throw error
            return data
        },
        onSuccess: () => {
            // Invalide le cache pour forcer un rafraîchissement de la liste
            queryClient.invalidateQueries({ queryKey: ['games'] })
        },
    })
}