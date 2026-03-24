import React, { createContext, useContext, useState, useEffect } from 'react';

const InstallContext = createContext();

export const InstallProvider = ({ children }) => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        // Detect standalone mode
        const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
        setIsStandalone(!!standalone);

        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const vendor = window.navigator.vendor ? window.navigator.vendor.toLowerCase() : '';
        const isIpadOS = (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        const ios = /iphone|ipad|ipod/.test(userAgent) || isIpadOS || (vendor.includes('apple') && /mobile/.test(userAgent));
        setIsIOS(ios);

        // Pre-set installable for iOS if not standalone
        if (ios && !standalone) {
            setIsInstallable(true);
        }

        // Listen for beforeinstallprompt (Android/Desktop)
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const promptInstall = () => {
        if (isIOS) {
            setShowInstructions(true);
        } else if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                    setIsInstallable(false);
                }
                setDeferredPrompt(null);
            });
        }
    };

    return (
        <InstallContext.Provider value={{ 
            isInstallable, 
            isIOS, 
            isStandalone, 
            showInstructions, 
            setShowInstructions, 
            promptInstall 
        }}>
            {children}
        </InstallContext.Provider>
    );
};

export const useInstall = () => {
    const context = useContext(InstallContext);
    if (!context) {
        throw new Error('useInstall must be used within an InstallProvider');
    }
    return context;
};
