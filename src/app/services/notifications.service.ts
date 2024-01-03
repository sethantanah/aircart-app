import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { getMessaging, getToken, onMessage} from 'firebase/messaging';


import { onBackgroundMessage } from 'firebase/messaging/sw';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  currentMessage = new BehaviorSubject(null);

  constructor(private angularFireMessaging: AngularFireMessaging, private storage: StorageService,
        private afs: AngularFirestore,private cookie: CookieService) {
    this.angularFireMessaging.messages.subscribe(
      (_messaging: any) => {
      _messaging.onMessage = _messaging.onMessage.bind(_messaging);
      _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    });
    }



    // getAccessToken() {
    //   return new Promise((resolve, reject) =>{
    //     const key = require('../placeholders/service-account.json');
    //     const jwtClient = new google.auth.JWT(
    //       key.client_email,
    //       null,
    //       key.private_key,
    //       SCOPES,
    //       null
    //     );
    //     jwtClient.authorize(function(err, tokens) {
    //       if (err) {
    //         reject(err);
    //         return;
    //       }
    //       resolve(tokens.access_token);
    //     });
    //   });
    // }
    



















    requestPermission() {
   try{
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: 'BB8l6JaeaBeTnaJ5VMVUMExQDXY91iuyqWwyXDFFALZBq5Ujx7quDPJvD9Chrrj1F_wphhDDvgKTl6TutCJ7OYE' })
    .then((currentToken) => {
      if (currentToken) {
        this.storage.setItem('appToken', currentToken);
        if(this.cookie.check('appToken')){
          this.afs.collection('notificationtokens').add({currentToken});
        }
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    });






   }catch{}
    }
    receiveMessage() {
// Get registration token. Initially this makes a network call, once retrieved
// subsequent calls to getToken will return from cache.
try{
  const messaging = getMessaging();
getToken(messaging, { vapidKey: 'BB8l6JaeaBeTnaJ5VMVUMExQDXY91iuyqWwyXDFFALZBq5Ujx7quDPJvD9Chrrj1F_wphhDDvgKTl6TutCJ7OYE' }).
then((currentToken) => {
  if (currentToken) {
    // Send the token to your server and update the UI if necessary
    // ...
  } else {
    // Show permission request UI
    console.log('No registration token available. Request permission to generate one.');
    // ...
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
  // ...
});

onMessage(messaging, (payload) => {
 // console.log('Message received. ', payload);
  // ...
});


onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  // self?.registration.showNotification(notificationTitle,
  //   notificationOptions);
});


    this.angularFireMessaging.messages.subscribe(
    (payload) => {
   // console.log('new message received. ', payload);
    this.currentMessage.next(payload);
    });
}catch{

}
    }



    sendOrderNotification(){
      const registrationToken = 'YOUR_REGISTRATION_TOKEN';

      const message = {
        data: {
          score: 'You have new orders',
          time: '2:45'
        },
        token: registrationToken
      };

      // Send a message to the device corresponding to the provided
      // registration token.
      // getMessaging().send(message)
      //   .then((response) => {
      //     // Response is a message ID string.
      //     console.log('Successfully sent message:', response);
      //   })
      //   .catch((error) => {
      //     console.log('Error sending message:', error);
      //   });
    }
  }

