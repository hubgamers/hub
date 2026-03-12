import { Avatar } from "../ui-components";

export default function SidebarFooter({ user, router, collapsed }) {
    return (
        <div style={{ borderTop: "1px solid var(--border)", padding: "12px" }}>
            {user.role === "ADMIN" && !collapsed && (
                <button
                    onClick={() => router.push("/dashboard")}
                    style={{
                        width: "100%", padding: "8px", borderRadius: 6, marginBottom: 12,
                        background: `${theme.accent}10`, border: `1px solid ${theme.accent}`,
                        color: theme.accent, fontSize: 10, fontWeight: 800, cursor: "pointer"
                    }}
                >
                </button>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: collapsed ? "center" : "flex-start" }}>
                <Avatar name={user.name} src={user.avatar} size={32} />
                {!collapsed && (
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{user.name}</div>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>{user.email}</div>
                    </div>
                )}
            </div>
        </div>
    )
}