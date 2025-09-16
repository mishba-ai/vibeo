import { createContext, useState, useEffect, type PropsWithChildren } from 'react'
import api from '../api/axiosInstance'
const API_BASE_URL = process.env.EXPRESS_API_BASE_URL
interface User {
    id:string;
    googleId: string;
    email: string;
    username: string;
    avatar: string;
    
}
export interface AuthContextType {
    user: User | null;
    handleGoogleLogin: () => void;
    logout: () => Promise<void>;
    loading: boolean;
}
export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    // This effect runs once on app load to check if the user is logged in
    useEffect(() => {
        const fetchAuthStatus = async () => {
            try {
                const response = await api.get('auth/feed')
                setUser(response.data.user)
            } catch (error) {
                console.error('euser not authenticated', error)
                setUser(null)
            } finally {
                setLoading(false)
            }
        };
        fetchAuthStatus()
    }, [])

    const handleGoogleLogin = () => {
        window.location.href = `${API_BASE_URL}/auth/google`;
    }

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    const value = {
        user, handleGoogleLogin, logout, loading
    }

    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    );
}

