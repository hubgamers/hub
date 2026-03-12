"use client"

import { useState } from "react"
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

    // 1. ÉTATS LOCAUX
    const [collapsed, setCollapsed] = useState(false)
    const [showOrgMenu, setShowOrgMenu] = useState(false)
    const [activeOrg, setActiveOrg] = useState<Organization>(organizations[0])

    // 2. TRI DES NAVITEMS (ADMIN EN HAUT)
    const sortedNavItems = [...navItems].sort((a, b) => {
        if (a.context === NavigationContext.ADMIN_SaaS && b.context !== NavigationContext.ADMIN_SaaS) return -1;
        if (a.context !== NavigationContext.ADMIN_SaaS && b.context === NavigationContext.ADMIN_SaaS) return 1;
        return 0;
    });

    return (
        <aside
            style={{
                width: collapsed ? 64 : 260,
                transition: "width 0.25s ease",
                display: "flex", flexDirection: "column", height: "100vh",
                background: "var(--surface)", borderRight: "1px solid var(--border)",
                position: "relative"
            }}
        >
            {/* --- HEADER --- */}
            <div style={{
                height: 56, display: "flex", alignItems: "center",
                padding: collapsed ? "0" : "0 16px",
                justifyContent: collapsed ? "center" : "space-between",
                borderBottom: "1px solid var(--border)",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: 6,
                        background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                        display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                        <Icon d={Icons.controller} size={14} color="white" />
                    </div>
                    {!collapsed && (
                        <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 17 }}>
                            Hub<span style={{ color: "var(--accent)" }}>Gamers</span>
                        </span>
                    )}
                </div>
                <button onClick={() => setCollapsed(!collapsed)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}>
                    <Icon d={collapsed ? Icons.chevronRight : Icons.chevronLeft} size={14} />
                </button>
            </div>

            {/* --- SELECTEUR D'ORG --- */}
            {!collapsed && organizations.length > 0 && (
                <div style={{ padding: "12px" }}>
                    <button
                        onClick={() => setShowOrgMenu(!showOrgMenu)}
                        style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 10,
                            padding: "10px", background: "var(--elevated)", borderRadius: 8,
                            border: "1px solid var(--border2)", cursor: "pointer"
                        }}
                    >
                        <Avatar name={activeOrg.name} size={24} />
                        <div style={{ flex: 1, textAlign: "left", minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis" }}>{activeOrg.name}</div>
                            <OrgTypePill type={activeOrg.type} />
                        </div>
                        <Icon d={Icons.chevronDown} size={12} color="var(--muted)" />
                    </button>
                </div>
            )}

            {/* --- NAVIGATION --- */}
            <nav style={{ flex: 1, padding: "12px", overflowY: "auto" }}>
                {sortedNavItems.map((item) => {
                    const isActive = pathname === item.href
                    const isAdminItem = item.context === NavigationContext.ADMIN_SaaS

                    return (
                        <div
                            key={item.href}
                            onClick={() => router.push(item.href)}
                            style={{
                                display: "flex", alignItems: "center", gap: 12,
                                padding: collapsed ? "12px 0" : "10px 12px",
                                justifyContent: collapsed ? "center" : "flex-start",
                                borderRadius: 8, cursor: "pointer",
                                background: isActive ? "var(--accent15)" : "transparent",
                                color: isActive ? "var(--accent)" : "var(--muted)",
                                marginBottom: 4
                            }}
                        >
                            <Icon d={Icons[item.icon]} size={18} />

                            {isAdminItem && (
                                <span style={{
                                    fontSize: 9, fontWeight: 800,
                                    background: isActive ? "var(--accent)" : "var(--border)",
                                    color: isActive ? "white" : "var(--muted)",
                                    padding: "2px 5px", borderRadius: 4,
                                    textTransform: "uppercase", letterSpacing: "0.02em"
                                }}>
                                    Admin
                                </span>
                            )}

                            {!collapsed && (
                                <span style={{ fontSize: 14, fontWeight: isActive ? 600 : 500 }}>
                                    {item.label}
                                </span>
                            )}
                        </div>
                    )
                })}
            </nav>

            {/* --- FOOTER --- */}
            <SidebarFooter user={user} router={router} collapsed={collapsed} />
        </aside>
    )
}