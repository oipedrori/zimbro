import { useEffect } from 'react';
import { messaging } from '../config/firebase';
import { getToken, onMessage } from 'firebase/messaging';

const NotificationHandler = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      if (!messaging) return;

      try {
        // Solicita permissão
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Permissão de notificação concedida!');
          
          // Obtém o token (precisa da VAPID key do console do Firebase)
          const token = await getToken(messaging, { 
            vapidKey: 'BERfkXXXhGhptdwEsTIayna2gA0iJClW2wXAB7YPeMPWINNEH9eeHPUGlbfeIXyMB8cRyKlHePQv7J4SjxDU1mU' 
          });

          if (token) {
            console.log('FCM Token:', token);
            // Aqui você salvaria o token no banco de dados do usuário
          } else {
            console.log('Nenhum registration token disponível.');
          }
        }
      } catch (error) {
        console.error('Erro ao configurar notificações:', error);
      }
    };

    setupNotifications();

    // Listener para mensagens quando o app está aberto (foreground)
    let unsubscribe = () => {};
    if (messaging) {
      unsubscribe = onMessage(messaging, (payload) => {
        console.log('Mensagem recebida no foreground:', payload);
      });
    }

    return () => unsubscribe();
  }, []);

  return null;
};

export default NotificationHandler;
