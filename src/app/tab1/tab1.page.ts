import { ProductService } from './../services/product.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
///import { File } from '@awesome-cordova-plugins/file/ngx';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { CookieService } from 'ngx-cookie-service';
import { NotificationsService } from '../services/notifications.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit, OnDestroy {
  transparentToolBar = false;
  cartCount = 0;
  countSub: any;

  private promise: Promise<string>;
  private stringToWrite: string;
  private blob: Blob;

  constructor(
    private router: Router,
    productService: ProductService,
    private menu: MenuController,
    private cookie: CookieService,
    private platform: Platform,
    private notifications: NotificationsService
  ) {
    this.countSub = productService.cartCount.subscribe((res) => {
      if(res === 0 &&  this.cookie.check('cartCount')){
        this.cartCount = Number(this.cookie.get('cartCount'));

      }else{
        this.cartCount = res;
      }
    });
  }

  ngOnInit(){
    //this.notifications.requestPermission();
       // this.notifications.receiveMessage();
    // this.platform.ready().then(() => {
    //   if(!this.platform.is('mobileweb')) {
    //     this.pushNotifications();
    //   }else{
    //   }
    // });
  }

  // createFile() {
  //   this.file.createFile(this.file.dataDirectory, 'filename', true);
  //   this.writeFile();
  // }

  // async readFile() {
  //   this.promise = this.file.readAsText(this.file.dataDirectory, 'filename');

  //   await this.promise.then((value) => {
  //     alert(value);
  //   });
  // }

  // writeFile() {
  //   this.stringToWrite = 'I learned this from Medium';

  //   this.blob = new Blob([this.stringToWrite], { type: 'text/plain' });

  //   this.file.writeFile(this.file.dataDirectory, 'filename', this.blob, {
  //     replace: true,
  //     append: false,
  //   });

  //   this.readFile()
  // }

  onScroll(ev) {
    const offset = ev.detail.scrollTop;
    if (offset > 20) {
      this.transparentToolBar = true;
    } else {
      this.transparentToolBar = false;
    }
  }

  cartPage() {
    this.router.navigate(['tabs/tab3']);
  }

  ngOnDestroy(): void {
    this.countSub.unsubscribe();
  }

  openMenu() {
    this.menu.open();
  }

  pushNotifications(){
  //  console.log('Initializing HomePage');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        alert('Push registration success, token: ' + token.value);
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        alert('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }
}
