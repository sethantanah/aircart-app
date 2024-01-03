import { Component, NgZone,  ApplicationRef } from '@angular/core';
import { Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { SwUpdate, UpdateAvailableEvent, VersionReadyEvent } from '@angular/service-worker';
import { ToastController } from '@ionic/angular';

import {filter, map} from 'rxjs/operators';

// import serviceAccount  from '../ecommerce-engine01-3401c-firebase-adminsdk-2j160-59d847e4f1.json';
// import * as admin from 'firebase-admin';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router, private zone: NgZone, appRef: ApplicationRef, private updates: SwUpdate,
    private toastController: ToastController) {
   this.initializeApp();

  //  updates.available.subscribe(event => {
  //   if (promptUser(event)) {
  //     updates.activateUpdate().then(() => document.location.reload());
  //   }
  // });

  const updatesAvailable =  updates.versionUpdates.pipe(
       filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
       map(evt => ({
         type: 'UPDATE_AVAILABLE',
         current: evt.currentVersion,
         available: evt.latestVersion,
       })));

       updatesAvailable.subscribe((available) => {
        if(available.available !== available.current){
          this.presentToastWithOptions();
        }
       });
8
       updates.unrecoverable.subscribe(event => {
        this.presentToast('An error occurred that we cannot recover from:\n' +
        event.reason +
        '\n\nPlease reload the page.');
      });
    // this. init();
  }
  //8C:E5:AB:B7:C2:6C:CF:7C:73:3E:33:60:D8:A3:F5:B3:1A:E8:92:AA:8C:E5:13:FC:5C:50:A5:12:B8:6A:F1:22


  init() {
    // admin.initializeApp({
    //     credential: admin.credential.cert(serviceAccount),
    // });

}

  initializeApp() {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
        this.zone.run(() => {
            // Example url: https://beerswift.app/tabs/tab2
            // slug = /tabs/tab2
            const slug = event.url.split('.app').pop();
            if (slug) {
                this.router.navigateByUrl(slug);
            }
            // If no match, do nothing - let regular routing
            // logic take over
        });
    });
}

async presentToastWithOptions() {
  const toast = await this.toastController.create({
    header: 'An update for AirCart is ready',
    message: '',
    icon: 'information-circle',
    position: 'bottom',
    buttons: [
      {
        icon: 'download',
        text: 'Install now',
        handler: () => {
          this.updates.activateUpdate().then(() => {
            document.location.reload();
            toast.onDidDismiss();
          });
        }
      },

    ]
  });
  await toast.present();

  const { role } = await toast.onDidDismiss();
 // console.log('onDidDismiss resolved with role', role);
}

async presentToast(msg: string) {
  const toast = await this.toastController.create({
    message: msg,
    duration: 2000,
    position: 'top'
  });
  toast.present();
}
}

