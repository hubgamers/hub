import { createApiHooks } from './createApiHooks';

export const { 
    useGetAll: useProfiles, 
    useGetById: useProfile 
} = createApiHooks('profiles');