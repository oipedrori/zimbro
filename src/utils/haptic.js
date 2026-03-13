/**
 * Utilitário para feedback háptico (vibração)
 */
export const haptic = {
    /**
     * Vibração curta e leve (sucesso ou toque)
     */
    light: () => {
        try {
            if (navigator.vibrate) {
                navigator.vibrate(15);
            }
        } catch (e) {}
    },
    medium: () => {
        try {
            if (navigator.vibrate) {
                navigator.vibrate(30);
            }
        } catch (e) {}
    },
    success: () => {
        try {
            if (navigator.vibrate) {
                navigator.vibrate([20, 50, 20]);
            }
        } catch (e) {}
    },
    error: () => {
        try {
            if (navigator.vibrate) {
                navigator.vibrate([50, 100, 50, 100, 50]);
            }
        } catch (e) {}
    },
    heavy: () => {
        try {
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
        } catch (e) {}
    }
};
