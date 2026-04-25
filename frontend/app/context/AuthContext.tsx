import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
    user: any | null;
    isAuthenticated: boolean;
    login: (access: string, refresh: string, userData: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Hydrate from localStorage on mount
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("access_token");

        if (storedToken) {
            setAccessToken(storedToken);
            if (storedUser && storedUser !== "undefined") {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error("Failed to parse user from localStorage", e);
                }
            }
        }
        setIsInitialized(true);
    }, []);

    const login = (access: string, refresh: string, userData: any) => {
        // Clear old legacy keys to prevent stale token bugs
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
        }
        setAccessToken(access);
        setUser(userData || null);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");
        setAccessToken(null);
        setUser(null);
    };

    if (!isInitialized) {
        return null; // Prevent flash of unauthenticated UI
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!accessToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
