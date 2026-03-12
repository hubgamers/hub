"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Icons, Icon } from "./icons"
import { Avatar, OrgTypePill } from "./ui-components"

// --- TYPES ---
interface NavItem {
    label: string
    href: string
    icon: keyof typeof Icons
    badge?: number
}

interface Organization {
    id: string
    name: string
    type: "SPORT" | "ESPORT" | "MIXED"
}

interface SidebarProps {
    user: {
        name: string
        email: string
        avatar?: string
    }
    navItems: NavItem[]
    organizations: Organization[]
}

// --- COMPOSANT PRINCIPAL ---
export function Sidebar({ user, navItems, organizations }: SidebarProps) {
    const router = useRouter()
    const pathname = usePathname()

    // États locaux
    const [collapsed, setCollapsed] = useState(false)
    const [showOrgMenu, setShowOrgMenu] = useState(false)
    const [activeOrg, setActiveOrg] = useState<Organization>(organizations[0])

    const W_CLOSED = 64
    const W_OPEN = 260

    return (
        <aside
            className={`hub-sidebar ${collapsed ? "collapsed" : ""}`}
            style={{
                width: collapsed ? W_CLOSED : W_OPEN,
                transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                background: "var(--surface)",
                borderRight: "1px solid var(--border)",
                position: "relative"
            }}
        >
            {/* 1. LOGO & TOGGLE */}
            <div style={{
                height: 56, display: "flex", alignItems: "center",
                padding: collapsed ? "0" : "0 16px",
                justifyContent: collapsed ? "center" : "space-between",
                borderBottom: "1px solid var(--border)", flexShrink: 0,
            }}>
                {!collapsed && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="logo-icon-bg" style={{
                            width: 28, height: 28, borderRadius: 6,
                            background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                            <Icon d={Icons.controller} size={14} />
                        </div>
                        <span style={{
                            fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 17, color: "var(--text)"
                        }}>
                            Hub<span style={{ color: "var(--accent)" }}>Gamers</span>
                        </span>
                    </div>
                )}

                {collapsed && (
                    <div className="logo-icon-bg" style={{
                        width: 28, height: 28, borderRadius: 6,
                        background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                        display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                        <Icon d={Icons.controller} size={14} />
                    </div>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="toggle-btn"
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}
                >
                    <Icon d={collapsed ? Icons.chevronRight : Icons.chevronLeft} size={15} />
                </button>
            </div>

            {/* 2. ORG SELECTOR */}
            {activeOrg && (
                <div style={{ padding: collapsed ? "12px 8px" : "12px", flexShrink: 0, position: "relative" }}>
                    <button
                        className="org-btn"
                        onClick={() => setShowOrgMenu(!showOrgMenu)}
                        style={{
                            width: "100%", display: "flex", alignItems: "center", gap: 10,
                            padding: collapsed ? "10px 0" : "10px 12px",
                            justifyContent: collapsed ? "center" : "flex-start",
                            background: "var(--elevated)", borderRadius: 8, border: "1px solid var(--border2)",
                            cursor: "pointer"
                        }}
                    >
                        <Avatar name={activeOrg.name} size={26} />
                        {!collapsed && (
                            <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                                <div style={{
                                    fontSize: 12.5, fontWeight: 600, color: "var(--text)",
                                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
                                }}>
                                    {activeOrg.name}
                                </div>
                                <OrgTypePill type={activeOrg.type} />
                            </div>
                        )}
                    </button>

                    {/* Dropdown Orgs */}
                    {showOrgMenu && (
                        <div className="dropdown" style={{
                            position: "absolute", zIndex: 100,
                            top: collapsed ? 12 : "100%",
                            left: collapsed ? W_CLOSED + 8 : 12,
                            width: 220, background: "var(--surface)",
                            border: "1px solid var(--border)", borderRadius: 8, boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
                        }}>
                            <div style={{ padding: "4px" }}>
                                {organizations.map(org => (
                                    <button
                                        key={org.id}
                                        onClick={() => { setActiveOrg(org); setShowOrgMenu(false) }}
                                        className="dropdown-item"
                                        style={{
                                            display: "flex", alignItems: "center", gap: 10, width: "100%",
                                            padding: "8px 10px", border: "none", background: "none",
                                            color: "var(--text)", cursor: "pointer", borderRadius: 6, textAlign: "left"
                                        }}
                                    >
                                        <Avatar name={org.name} size={24} />
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 500 }}>{org.name}</div>
                                            <OrgTypePill type={org.type} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="glow-line" style={{ height: 1, background: "var(--border)", margin: "0 12px" }} />

            {/* 3. NAVIGATION */}
            <nav style={{ flex: 1, padding: collapsed ? "12px 8px" : "12px", overflowY: "auto" }}>
                {!collapsed && (
                    <div style={{
                        fontSize: 10, fontWeight: 700, color: "var(--muted)",
                        textTransform: "uppercase", padding: "0 12px 8px", letterSpacing: "0.05em"
                    }}>
                        Menu Principal
                    </div>
                )}

                {navItems.map(item => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                    return (
                        <div
                            key={item.href}
                            className={`nav-item ${isActive ? "active" : ""}`}
                            onClick={() => router.push(item.href)}
                            title={collapsed ? item.label : undefined}
                        >
                            <Icon d={Icons[item.icon]} size={17} />
                            {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}

                            {item.badge && (
                                <span className={collapsed ? "badge-dot" : "badge-pill"}>
                                    {collapsed ? "" : item.badge}
                                </span>
                            )}
                        </div>
                    )
                })}
            </nav>

            {/* 4. USER PROFILE */}
            <div style={{
                borderTop: "1px solid var(--border)", padding: collapsed ? "12px 8px" : "16px 12px", flexShrink: 0
            }}>
                <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    justifyContent: collapsed ? "center" : "flex-start"
                }}>
                    <Avatar name={user.name} src={user.avatar} size={32} />
                    {!collapsed && (
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontSize: 13, fontWeight: 600, color: "var(--text)",
                                overflow: "hidden", textOverflow: "ellipsis"
                            }}>{user.name}</div>
                            <div style={{
                                fontSize: 11, color: "var(--muted)",
                                overflow: "hidden", textOverflow: "ellipsis"
                            }}>{user.email}</div>
                        </div>
                    )}
                    {!collapsed && (
                        <button
                            onClick={() => router.push("/logout")}
                            style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}
                        >
                            <Icon d={Icons.logout} size={15} />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    )
}