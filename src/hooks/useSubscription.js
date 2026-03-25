import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

export const useSubscription = () => {
    const { currentUser } = useAuth();
    const [subscription, setSubscription] = useState({
        status: 'free',
        isPremium: false,
        loading: true
    });

    useEffect(() => {
        if (!currentUser?.uid) {
            setSubscription({ status: 'free', isPremium: false, loading: false });
            return;
        }

        const unsubscribe = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const status = data.subscription_status || 'free';
                setSubscription({
                    status,
                    isPremium: status === 'active' || status === 'trialing',
                    loading: false
                });
            } else {
                setSubscription({ status: 'free', isPremium: false, loading: false });
            }
        });

        return () => unsubscribe();
    }, [currentUser]);

    return subscription;
};
