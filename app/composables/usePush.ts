import { firebaseApp } from "#imports";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

export const usePush = () => {
  const vapidKey = "BKD9gChhq5A2nw6_SgZ7nw9rWPiKx1lZo5Nq4jIR3FH22_SJ_Y2PG8PBD5wvN6W0YLvr3sKvQKP-l7NFd1fQabA";

  // Register SW + ask permission + get token
  const askPermission = async () => {
    if (!process.client) return;

    // ✅ Register the service worker FIRST
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('✅ Service Worker registered:', registration);

    const messaging = getMessaging(firebaseApp);

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Notification permission not granted");
    }

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration, // ✅ Pass it here
    });

    console.log("✅ FCM Token:", token);
    return token;
  };

  // Foreground listener
  const startListening = () => {
    if (!process.client) return;

    const messaging = getMessaging(firebaseApp);

    onMessage(messaging, (payload) => {
      alert(`Notification received:\nTitle: ${payload.notification?.title}\nBody: ${payload.notification?.body}`);
      console.log("✅ Foreground message:", payload);
    });
  };

  return {
    askPermission,
    startListening,
  };
};
