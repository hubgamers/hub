import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Database, Tables, TablesInsert, TablesUpdate } from '../types/schema' // Ajuste le chemin
import { supabase } from '../supabase'

type PublicSchema = Database['public']
type TableName = keyof PublicSchema['Tables']

/**
 * Construit une requête de filtre pour les clés primaires simples ou composites.
 */
const buildKeyQuery = (
  query: any,
  pk: string | string[],
  id: string | string[]
) => {
  if (Array.isArray(pk) && Array.isArray(id)) {
    pk.forEach((key, index) => {
      query = query.eq(key, id[index])
    })
  } else {
    query = query.eq(pk as string, id as string)
  }
  return query
}

/**
 * Crée un ensemble de hooks React Query pour une table Supabase spécifique.
 */
export const createApiHooks = <T extends TableName>(
  tableName: T,
  primaryKey: keyof Tables<T> | (keyof Tables<T>)[] = 'id' as any
) => {
  // Aliases de types pour la lisibilité
  type Row = Tables<T>
  type Insert = TablesInsert<T>
  type Update = TablesUpdate<T>

  const queryKeys = {
    all: [tableName] as const,
    lists: () => [...queryKeys.all, 'list'] as const,
    list: (filters: string) => [...queryKeys.lists(), { filters }] as const,
    details: () => [...queryKeys.all, 'detail'] as const,
    detail: (id: string | string[]) => [...queryKeys.details(), id] as const,
  }

  const useGetAll = () =>
    useQuery({
      queryKey: queryKeys.lists(),
      queryFn: async () => {
        const { data, error } = await supabase.from(tableName).select('*')
        if (error) throw error
        return data as Row[]
      },
    })

  const useGetById = (id: string | string[]) =>
    useQuery({
      queryKey: queryKeys.detail(id),
      queryFn: async () => {
        // On s'assure que le query builder est bien initialisé
        const baseQuery = supabase.from(tableName).select('*')

        // On applique les filtres via buildKeyQuery
        const queryWithFilters = buildKeyQuery(baseQuery, primaryKey as string | string[], id)

        // .maybeSingle() évite l'erreur 406 si l'ID est temporairement invalide
        // ou si la ligne n'existe pas encore.
        const { data, error } = await queryWithFilters.maybeSingle()

        if (error) {
          console.error(`Erreur API [${tableName}]:`, error.message)
          throw error
        }

        return data as Row
      },
      // Le hook ne s'exécute que si l'ID est présent et valide
      enabled: Array.isArray(id) ? id.length > 0 && id.every(Boolean) : !!id,
    })

  const useCreate = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (item: Insert) => {
        // @ts-ignore - Supabase peut être capricieux avec les génériques complexes
        const { data, error } = await supabase.from(tableName).insert(item).select().single()
        if (error) throw error
        return data as Row
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.all })
      },
    })
  }

  const useUpdate = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async ({ id, payload }: { id: string | string[]; payload: Update }) => {
        let query = supabase.from(tableName).update(payload as any)
        query = buildKeyQuery(query, primaryKey as string | string[], id)

        const { data, error } = await query.select().single()
        if (error) throw error
        return data as Row
      },
      onSuccess: (data, { id }) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.all })
        if (data) {
          queryClient.setQueryData(queryKeys.detail(id), data)
        }
      },
    })
  }

  const useDelete = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: async (id: string | string[]) => {
        let query = supabase.from(tableName).delete()
        query = buildKeyQuery(query, primaryKey as string | string[], id)

        const { error } = await query
        if (error) throw error
      },
      onSuccess: (_data, id) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.all })
        queryClient.removeQueries({ queryKey: queryKeys.detail(id) })
      },
    })
  }

  return { useGetAll, useGetById, useCreate, useUpdate, useDelete, queryKeys }
}