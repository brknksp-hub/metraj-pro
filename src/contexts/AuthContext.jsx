import { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInAnonymously,
    signOut,
    signInWithCustomToken,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for initial custom token (legacy pattern support)
        const initAuth = async () => {
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token && auth) {
                try {
                    await signInWithCustomToken(auth, __initial_auth_token);
                } catch (e) {
                    console.warn("Token mismatch, waiting for manual login.");
                }
            }
        };
        initAuth();

        if (auth) {
            const unsubscribe = onAuthStateChanged(auth, (u) => {
                setUser(u);
                setLoading(false);
            });
            return () => unsubscribe();
        } else {
            setLoading(false);
        }
    }, []);

    const loginAnonymously = async () => {
        if (!auth) throw new Error("Firebase not initialized");
        return signInAnonymously(auth);
    };

    const loginEmailPassword = async (email, password) => {
        if (!auth) throw new Error("Firebase not initialized");
        console.log("AuthContext: signInWithEmailAndPassword called");
        return signInWithEmailAndPassword(auth, email, password);
    };

    const registerEmailPassword = async (email, password) => {
        if (!auth) throw new Error("Firebase not initialized");
        console.log("AuthContext: createUserWithEmailAndPassword called");
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        if (auth) return signOut(auth);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            loginAnonymously,
            loginEmailPassword,
            registerEmailPassword,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
