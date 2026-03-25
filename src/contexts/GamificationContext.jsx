import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUnlockedMilestones, calculateTotalSavings, calculateDaysSinceCreation, GAMIFICATION_CATEGORIES } from '../utils/gamification';

const GamificationContext = createContext();

export const useGamification = () => {
    return useContext(GamificationContext);
};

export const GamificationProvider = ({ children }) => {
    const { currentUser } = useAuth();
    
    // States for unlocked badges
    const [unlockedBadges, setUnlockedBadges] = useState([]);
    
    // State for the Unlock Modal queue
    const [unlockQueue, setUnlockQueue] = useState([]);

    // We need to load previously unlocked badges from localStorage to avoid spamming the anim
    useEffect(() => {
        if (!currentUser) {
            setUnlockedBadges([]);
            setUnlockQueue([]);
            return;
        }

        const cached = localStorage.getItem(`zimbroo_badges_${currentUser.uid}`);
        if (cached) {
            setUnlockedBadges(JSON.parse(cached));
        }
    }, [currentUser]);

    // This function should be called inside a component that has access to allTransactions 
    // or whenever transactions change (like in Home.jsx or a central hook).
    // For simplicity, we can expose a function to trigger the evaluation.
    const evaluateAchievements = (transactions) => {
        if (!currentUser) return;

        const txCount = transactions.length;
        const totalSavings = calculateTotalSavings(transactions);
        const daysSinceCreation = calculateDaysSinceCreation(currentUser.metadata?.creationTime);

        const earnedTxs = getUnlockedMilestones('transactions', txCount);
        const earnedSavings = getUnlockedMilestones('savings', totalSavings);
        const earnedTime = getUnlockedMilestones('time', daysSinceCreation);

        const currentEarnedIds = [...earnedTxs, ...earnedSavings, ...earnedTime];
        
        // Find new un-cached badges
        const newBadges = currentEarnedIds.filter(id => !unlockedBadges.includes(id));
        
        if (newBadges.length > 0) {
            // Update cache
            const updatedBadges = [...unlockedBadges, ...newBadges];
            setUnlockedBadges(updatedBadges);
            localStorage.setItem(`zimbroo_badges_${currentUser.uid}`, JSON.stringify(updatedBadges));

            // Map new badges to full objects for the modal
            const newBadgeObjects = newBadges.map(badgeId => {
                // Find which category and milestone this badge belongs to
                for (const catKey in GAMIFICATION_CATEGORIES) {
                    const cat = GAMIFICATION_CATEGORIES[catKey];
                    const milestone = cat.milestones.find(m => m.id === badgeId);
                    if (milestone) {
                        return { 
                            id: badgeId, 
                            title: milestone.label, 
                            categoryTitle: cat.title, 
                            color: cat.color 
                        };
                    }
                }
                return null;
            }).filter(Boolean);

            // Add to queue to show sequentially if multiple are unlocked at once
            setUnlockQueue(prev => [...prev, ...newBadgeObjects]);
        }
    };

    const dismissCurrentUnlock = () => {
        setUnlockQueue(prev => prev.slice(1));
    };

    return (
        <GamificationContext.Provider value={{ 
            unlockedBadges, 
            evaluateAchievements,
            unlockQueue,
            dismissCurrentUnlock
        }}>
            {children}
            {/* The Unlock Modal component will be placed at the App level to overlay everything */}
        </GamificationContext.Provider>
    );
};
