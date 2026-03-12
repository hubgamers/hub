"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
    user: any;
    navItems: any[];
    organizations: any[];
    activeOrg: any;
    setActiveOrg: (org: any) => void; // Pour changer d'org depuis n'importe quelle page
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({
    children,
    initialData,
}: {
    children: ReactNode;
    initialData: { user: any; navItems: any[]; organizations: any[] };
}) {
    // On initialise l'org active avec la première de la liste
    const [activeOrg, setActiveOrg] = useState(initialData.organizations[0] || null);

    return (
        <UserContext.Provider
            value={{
                ...initialData,
                activeOrg,
                setActiveOrg,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser doit être utilisé dans un UserProvider");
    return context;
};