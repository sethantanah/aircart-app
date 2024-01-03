importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js");
firebase.initializeApp({
  projectId: 'ecommerce-engine01-3401c',
  appId: '1:865251929155:web:91919896029f59300138f6',
  storageBucket: 'ecommerce-engine01-3401c.appspot.com',
  locationId: 'europe-west',
  apiKey: 'AIzaSyDi1QRvNjaqK4oyGSwceRE-bEwSOk6Al9M',
  authDomain: 'ecommerce-engine01-3401c.firebaseapp.com',
  messagingSenderId: '865251929155',
  measurementId: 'G-3R43BJTE09',
});
 messaging = firebase.messaging();


 // Not necessary, but if you want to handle clicks on notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const pathname = event.notification?.data?.FCM_MSG?.notification?.data?.link
  if (!pathname) return
  const url = new URL(pathname, self.location.origin).href

  event.waitUntil(
      self.clients
          .matchAll({ type: 'window', includeUncontrolled: true })
          .then((clientsArr) => {
              const hadWindowToFocus = clientsArr.some((windowClient) =>
                  windowClient.url === url ? (windowClient.focus(), true) : false
              )

              if (!hadWindowToFocus)
                  self.clients
                      .openWindow(url)
                      .then((windowClient) =>
                          windowClient ? windowClient.focus() : null
                      )
          })
  )
})