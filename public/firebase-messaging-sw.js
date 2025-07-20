// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDJhu0HllKsqnAWT3gFyKm_ndr-AdQJzts",
  authDomain: "testpwa-9f6ad.firebaseapp.com",
  projectId: "testpwa-9f6ad",
  storageBucket: "testpwa-9f6ad.firebasestorage.app",
  messagingSenderId: "631863609293",
  appId: "1:631863609293:web:483a0c6c52fd594d0f6684"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
