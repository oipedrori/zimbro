import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { 
    signInWithPopup, 
    signInWithRedirect,
    getRedirectResult,
    signOut, 
    onAuthStateChanged, 
    deleteUser 
} from 'firebase/auth';
import LoadingDots from '../components/LoadingDots';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Detecta se é dispositivo mobile/Android (onde popups são bloqueados)
const isMobile = () => /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Login com Google: Redirect no mobile, Popup no desktop
    const loginWithGoogle = async () => {
        try {
            if (isMobile()) {
                // No Android/mobile, usamos redirect (evita bloqueio de popup)
                await signInWithRedirect(auth, googleProvider);
                // A página vai recarregar e o resultado será capturado no useEffect abaixo
            } else {
                const result = await signInWithPopup(auth, googleProvider);
                return result.user;
            }
        } catch (error) {
            console.error("Erro no login com Google:", error);
            throw error;
        }
    };

    // Logout
    const logout = async () => {
        try {
            if (currentUser) {
                localStorage.removeItem(`zimbroo_txs_${currentUser.uid}`);
            }
            await signOut(auth);
        } catch (error) {
            console.error("Erro no logout:", error);
        }
    };

    // Deletar Conta
    const deleteAccount = async () => {
        if (!currentUser) return;
        try {
            await deleteUser(currentUser);
        } catch (error) {
            console.error("Erro ao deletar conta:", error);
            throw error;
        }
    };

    // Monitorar estado da autenticação + capturar resultado do redirect (Android)
    useEffect(() => {
        console.log("🎬 AuthProvider useEffect triggered (auth exists:", !!auth, ")");

        // Safety timeout: if auth state doesn't resolve in 5s, let the app mount anyway
        const timeout = setTimeout(() => {
            if (loading) {
                console.warn("⏳ Auth resolution timeout reached. Forcing loading false.");
                setLoading(false);
            }
        }, 5000);

        if (!auth) {
            console.warn("⚠️ Auth service not available, skipping listener.");
            setLoading(false);
            clearTimeout(timeout);
            return;
        }

        // Captura resultado do signInWithRedirect (volta do redirect do Google no Android)
        getRedirectResult(auth)
            .then((result) => {
                if (result?.user) {
                    console.log("✅ Redirect result captured:", result.user.email);
                }
            })
            .catch((error) => {
                if (error.code !== 'auth/no-current-user') {
                    console.error("❌ Redirect result error:", error);
                }
            });

        try {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                console.log("👤 Auth state changed:", user ? user.email : "No user");
                setCurrentUser(user);
                setLoading(false);
                clearTimeout(timeout);
            }, (error) => {
                console.error("❌ Auth listener error:", error);
                setLoading(false);
                clearTimeout(timeout);
            });
            return () => {
                unsubscribe();
                clearTimeout(timeout);
            };
        } catch (err) {
            console.error("❌ Auth listener critical failure:", err);
            setLoading(false);
            clearTimeout(timeout);
        }
    }, [auth]);


    const value = {
        currentUser,
        loginWithGoogle,
        logout,
        deleteAccount,
        loading
    };

    if (loading) {
        return (
            <div style={{ 
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                background: 'var(--bg-color, #0f1710)', 
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                zIndex: 99999
            }}>
                <LoadingDots color="white" />
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
