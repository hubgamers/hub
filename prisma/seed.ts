// prisma/seed.ts
import { PrismaClient, NavigationContext } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('🚀 Début du seed des menus...')

    // --- 1. DÉFINITION DES MENUS PARENTS ---
    const parentItems = [
        // Admin SaaS Parents
        { name: 'admin_management', label: 'Gestion Plateforme', href: '#', icon: 'Shield', order: 1, context: NavigationContext.ADMIN_SaaS },
        { name: 'admin_system', label: 'Configuration', href: '#', icon: 'Settings', order: 2, context: NavigationContext.ADMIN_SaaS },

        // User Dashboard Parents
        { name: 'user_comp', label: 'Compétitions', href: '#', icon: 'Trophy', order: 2, context: NavigationContext.USER_DASHBOARD },
        { name: 'user_org', label: 'Mon Organisation', href: '#', icon: 'Building', order: 3, context: NavigationContext.USER_DASHBOARD },
    ]

    // --- 2. DÉFINITION DES ENFANTS (SUB-MENUS) ---
    const childItems = [
        // Sous-menus pour 'admin_management'
        { name: 'admin_orgs', label: 'Organisations', href: '/admin/organizations', icon: 'Globe', order: 1, context: NavigationContext.ADMIN_SaaS, parentName: 'admin_management' },
        { name: 'admin_users', label: 'Utilisateurs', href: '/admin/users', icon: 'Users', order: 2, context: NavigationContext.ADMIN_SaaS, parentName: 'admin_management' },

        // Sous-menus pour 'user_comp'
        { name: 'user_tournaments', label: 'Mes Tournois', href: '/dashboard/tournaments', icon: 'List', order: 1, context: NavigationContext.USER_DASHBOARD, parentName: 'user_comp' },
        { name: 'user_brackets', label: 'Arbres de tournois', href: '/dashboard/brackets', icon: 'GitMerge', order: 2, context: NavigationContext.USER_DASHBOARD, parentName: 'user_comp' },

        // Sous-menus pour 'user_org'
        { name: 'user_team', label: 'Membres', href: '/dashboard/team', icon: 'UserGroup', order: 1, context: NavigationContext.USER_DASHBOARD, parentName: 'user_org' },
        { name: 'user_settings', label: 'Paramètres', href: '/dashboard/settings', icon: 'Settings2', order: 2, context: NavigationContext.USER_DASHBOARD, parentName: 'user_org' },
    ]

    // --- 3. UPSERT DES PARENTS ---
    for (const item of parentItems) {
        await prisma.navigationItem.upsert({
            where: { name_context: { name: item.name, context: item.context } },
            update: item,
            create: item,
        })
    }

    // --- 4. UPSERT DES ENFANTS ---
    for (const item of childItems) {
        // On récupère l'ID du parent en fonction de son nom et contexte
        const parent = await prisma.navigationItem.findUnique({
            where: { name_context: { name: item.parentName, context: item.context } }
        })

        if (parent) {
            const { parentName, ...itemData } = item // On retire parentName pour Prisma
            await prisma.navigationItem.upsert({
                where: { name_context: { name: item.name, context: item.context } },
                update: { ...itemData, parentId: parent.id },
                create: { ...itemData, parentId: parent.id },
            })
        }
    }

    console.log('✅ Menus et sous-menus créés avec succès !')
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect())