import React, { createContext, useContext, useEffect, useState } from 'react';
import * as AuthSessions from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { api } from '../service/api';

const CLIENT_ID = '8b73a47109cbbd1b6537';
const SCOPE = 'read:user';
const USER_STORAGE = '@nlwheat:user';
const TOKEN_STORAGE = '@nlwheat:user';

type User = {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
}

type AuthContextData = {
    user: User | null;
    isSigningIn: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
}

type AuthContextProvider = {
    children: React.ReactNode;
}

type AuthResponse = {
    token: string;
    user: User;
}

type AuthorizationResponses = {
    params: {
        code?: string;
        error?: string;
    },
    type?: string;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthContextProvider) {
    const [isSigningIn, setIsSigningIn] = useState(true);
    const [ user, setUser ] = useState<User | null>(null);
    
    async function signIn() {
        try {
            setIsSigningIn(true);

            const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`;
            const AuthSessionResponse = await AuthSessions.startAsync({ authUrl }) as AuthorizationResponses;        
            
            if(AuthSessionResponse.type === 'success' && AuthSessionResponse.params.error !== 'access_denied'){
                const authResponse = await api.post('/authenticate', {
                    code: AuthSessionResponse.params.code
                })

                const { user, token } = authResponse.data as AuthResponse;

                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));

                await AsyncStorage.setItem(TOKEN_STORAGE, token);

                setUser(user);
            }
        } catch (err) {
            console.error(err)
        } finally {
            setIsSigningIn(false);
        }
    }

    async function signOut() {
        setUser(null);
        await AsyncStorage.removeItem(USER_STORAGE);
        await AsyncStorage.removeItem(TOKEN_STORAGE);
    }

    useEffect(() => {
        async function loadUserStorageData() {
            const userStorage = await AsyncStorage.getItem(USER_STORAGE);
            const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE);

            if(userStorage && tokenStorage) {
                api.defaults.headers.common['Authorization'] = `Bearer ${tokenStorage}`;

                setUser(JSON.parse(userStorage));
            }

            setIsSigningIn(false);
        }
        
        loadUserStorageData();
    }, [])

    return (
        <AuthContext.Provider value={{
            signIn,
            isSigningIn,
            signOut,
            user
        }}>
            { children }
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    return context
}