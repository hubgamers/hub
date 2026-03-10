import { createApiHooks } from './createApiHooks';

export const { 
    useGetAll: useTournaments, 
    useGetById: useTournament 
} = createApiHooks('tournaments');