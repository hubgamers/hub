"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Icons, Icon } from "./icons"
import { Avatar, OrgTypePill } from "./ui-components"
import { NavigationContext, NavigationItem, Organization } from "@prisma/client"
import SidebarFooter from "./sidebar/SidebarFooter"

interface SidebarProps {
    user: {
        name: string
        email: string
        avatar?: string
        role: "ADMIN" | "USER"
    }
    navItems: NavigationItem[]
    organizations: Organization[]
}

export function Sidebar({ user, navItems, organizations }: SidebarProps) {
    const router = useRouter()
    const pathname = usePathname()

    // --- ÉTATS LOCAUX ---
    const [collapsed, setCollapsed] = useState(false)
    const [showOrgMenu, setShowOrgMenu] = useState(false)
    const [activeOrg, setActiveOrg] = useState<Organization>(organizations[0])
    const [forceGlobalView, setForceGlobalView] = useState(false)

    // --- LOGIQUE DE VUE ---
    const isOnOrgPage = pathname.startsWith("/dashboard/org")
    const isShowingOrgMenu = isOnOrgPage && !forceGlobalView

    // Sécurité : Si on change de page vers une page non-org, on reset le mode visuel
    useEffect(() => {
        if (!isOnOrgPage) setForceGlobalView(false)
    }, [pathname, isOnOrgPage])

    // --- DYNAMIC HREF ---
    const getDynamicHref = (href: string) => {
        if (href.includes("[slug]")) {
            const slug = activeOrg?.slug || activeOrg?.id || ""
            // On s'assure que le remplacement inclut les slashs si nécessaire
            return href.replace("[slug]", slug)
        }

        // Sécurité supplémentaire : si c'est un item ORGANIZATION mais sans [slug]
        // on peut forcer le préfixe dynamiquement si tu ne veux pas changer ton seed
        if (isOnOrgPage && href.startsWith('/dashboard/') && !href.includes('/org/')) {
            const slug = activeOrg?.slug || activeOrg?.id || ""
            return href.replace('/dashboard/', `/dashboard/org/${slug}/`)
        }

        return href
    }

    // --- FILTRAGE ET TRI ---
    const displayItems = useMemo(() => {
        const filtered = isShowingOrgMenu
            ? navItems.filter(item => item.context === NavigationContext.ORGANIZATION)
            : navItems.filter(item => item.context !== NavigationContext.ORGANIZATION)

        return [...filtered].sort((a, b) => {
            if (a.context === NavigationContext.ADMIN_SaaS && b.context !== NavigationContext.ADMIN_SaaS) return -1
            if (a.context !== NavigationContext.ADMIN_SaaS && b.context === NavigationContext.ADMIN_SaaS) return 1
            return (a.order || 0) - (b.order || 0)
        })
    }, [navItems, isShowingOrgMenu])

    return (
        <aside style={{
            width: collapsed ? 64 : 260,
            transition: "width 0.25s ease",
            display: "flex", flexDirection: "column", height: "100vh",
            background: "var(--surface)", borderRight: "1px solid var(--border)",
            position: "relative"
        }}>

            {/* --- HEADER --- */}
            <div style={{
                height: 56, display: "flex", alignItems: "center",
                padding: collapsed ? "0" : "0 16px",
                justifyContent: collapsed ? "center" : "space-between",
                borderBottom: "1px solid var(--border)"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {isShowingOrgMenu ? (
                        <button
                            onClick={() => setForceGlobalView(true)}
                            title="Retour au menu principal"
                            style={{
                                background: "var(--border)", border: "none", borderRadius: 6,
                                width: 28, height: 28, cursor: "pointer", display: "flex",
                                alignItems: "center", justifyContent: "center"
                            }}
                        >
                            <Icon d={Icons.chevronLeft} size={14} color="var(--text)" />
                        </button>
                    ) : (
                        <div style={{
                            width: 28, height: 28, borderRadius: 6,
                            background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                            <Icon d={Icons.controller} size={14} color="white" />
                        </div>
                    )}

                    {!collapsed && (
                        <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 17 }}>
                            {isShowingOrgMenu ? "Org" : "Hub"}<span style={{ color: "var(--accent)" }}>{isShowingOrgMenu ? "Menu" : "Gamers"}</span>
                        </span>
                    )}
                </div>
                <button onClick={() => setCollapsed(!collapsed)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}>
                    <Icon d={collapsed ? Icons.chevronRight : Icons.chevronLeft} size={14} />
                </button>
            </div>

            {/* --- SELECTEUR / BOUTON RE-ENTRÉE ORG --- */}
            {!collapsed && organizations.length > 0 && (
                <div style={{ padding: "12px" }}>
                    <button
                        onClick={() => {
                            if (isOnOrgPage && forceGlobalView) setForceGlobalView(false)
                            else if (!isOnOrgPage) router.push(`/dashboard/org/${activeOrg.slug || activeOrg.id}`)
                            else setShowOrgMenu(!showOrgMenu)
                        }}
                        style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 10,
                            padding: "10px",
                            background: isShowingOrgMenu ? "var(--accent15)" : "var(--elevated)",
                            borderRadius: 8,
                            border: `1px solid ${isShowingOrgMenu || (isOnOrgPage && forceGlobalView) ? "var(--accent)" : "var(--border2)"}`,
                            cursor: "pointer", transition: "all 0.2s"
                        }}
                    >
                        <Avatar name={activeOrg.name} size={24} />
                        <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                            <div style={{ fontSize: 10, color: (isOnOrgPage && forceGlobalView) ? "var(--accent)" : "var(--muted)", fontWeight: 700, textTransform: "uppercase" }}>
                                {isOnOrgPage && forceGlobalView ? "Menu disponible" : "Organisation"}
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>{activeOrg.name}</div>
                        </div>
                        {isOnOrgPage && forceGlobalView ? (
                            <Icon d={Icons.chevronRight} size={14} color="var(--accent)" />
                        ) : (
                            <Icon d={Icons.chevronDown} size={12} color="var(--muted)" />
                        )}
                    </button>
                </div>
            )}

            {/* --- NAVIGATION --- */}
            <nav style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
                {!collapsed && (
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", padding: "0 12px 8px" }}>
                        {isShowingOrgMenu ? "Gestion Organisation" : "Navigation Principale"}
                    </div>
                )}
                {displayItems.map((item) => {
                    const realHref = getDynamicHref(item.href)
                    const isActive = pathname === realHref
                    const isAdminItem = item.context === NavigationContext.ADMIN_SaaS

                    return (
                        <div key={item.href} onClick={() => router.push(realHref)}
                            style={{
                                display: "flex", alignItems: "center", gap: 12,
                                padding: collapsed ? "12px 0" : "10px 12px",
                                justifyContent: collapsed ? "center" : "flex-start",
                                borderRadius: 8, cursor: "pointer",
                                background: isActive ? "var(--accent15)" : "transparent",
                                color: isActive ? "var(--accent)" : "var(--muted)",
                                marginBottom: 4, transition: "background 0.2s"
                            }}
                        >
                            <Icon d={Icons[item.icon as keyof typeof Icons]} size={18} />
                            {isAdminItem && (
                                <span style={{
                                    fontSize: 9, fontWeight: 800, background: isActive ? "var(--accent)" : "var(--border)",
                                    color: isActive ? "white" : "var(--muted)", padding: "2px 5px", borderRadius: 4, textTransform: "uppercase"
                                }}>
                                    Admin
                                </span>
                            )}
                            {!collapsed && <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 500 }}>{item.label}</span>}
                        </div>
                    )
                })}
            </nav>

            <SidebarFooter user={user} router={router} collapsed={collapsed} />
        </aside>
    )
}