importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCBmdLKxQRhWWdWM5ISxcDCHuyEdq0lq-o",
  authDomain: "zimbroo-app.firebaseapp.com",
  projectId: "zimbroo-app",
  storageBucket: "zimbroo-app.firebasestorage.app",
  messagingSenderId: "1055744833215",
  appId: "1:1055744833215:web:2a830953f49ca36336e147"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Mensagem recebida em segundo plano:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
