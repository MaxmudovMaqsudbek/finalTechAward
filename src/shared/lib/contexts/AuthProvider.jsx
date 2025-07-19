import {   useMemo, useState } from "react";
import { AuthContext } from "../../api/useAuth";

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = (username, password) => {
        // Hardcoded credentials as requested
        if (username === 'techaward' && password === '@tech123tech') {
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };
    
    const logout = () => setIsAuthenticated(false);

    const value = useMemo(() => ({ isAuthenticated, login, logout }), [isAuthenticated]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}