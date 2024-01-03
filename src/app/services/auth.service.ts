import { ProductService } from 'src/app/services/product.service';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';


import * as firebase from '@angular/fire/firestore';

import { getAuth, updateProfile } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { AlertController, ToastController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';


const UID_KEY = 'uid';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userupdates: BehaviorSubject<any> = new BehaviorSubject('');

  constructor(private auth: AngularFireAuth, private db: StorageService, private router: Router, 
      private toastCtrl: ToastController, private alertCtrl: AlertController, private productService: ProductService,
      private cookie: CookieService) { }

  getAuth(){
    return this.auth;
  }

  register(email: string, password: string, name: string) {

    return this.auth.createUserWithEmailAndPassword(email, password);


  }



  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }


  logout(){
    this.auth.signOut().then(res=> {
      this.presentToast('You have been loggedout');
      try{
        if(this.cookie.check('userinfo')){
          let user =  JSON.parse(this.cookie.get('userinfo')).email;
          this.cookie.deleteAll('/', 'https://aircart.shop');
          this.cookie.deleteAll('/tabs', 'https://aircart.shop');
          this.cookie.deleteAll('', 'https://aircart.shop');
          this.cookie.set('userinfo', JSON.stringify({email: user.email, cartId: user.cartId}));
          user = null;
        }
      }catch{
        this.cookie.deleteAll('/', 'https://aircart.shop');
        this.cookie.deleteAll('/tabs', 'https://aircart.shop');
        this.cookie.deleteAll('', 'https://aircart.shop');
      }
      //alert(this.cookie.check('userDocId'));
      this.userupdates.next('');
      this.productService.refreshData.next(5);
      this.productService.cartChanges.next(3);
    });
  }








  resetPasswordInit(email: string) {
    return this.auth.sendPasswordResetEmail(email);
  }

  resetPassword(email) {
    if (!email) {
      this.presentToast('Type in your email first');
    }
    this.resetPasswordInit(email)
      .then(
        () => { this.sendReset(); },
        (rejectionReason) => alert(rejectionReason))
      .catch(e =>  this.presentToast('An error occurred while attempting to reset your password, try again'));
  }

 




  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      mode: 'ios',
      duration: 2000,
      position: 'top',
      color: 'primary',
      icon: 'cart'
    });

    await toast.present();
  }


  async sendReset() {
    const alert = await this.alertCtrl.create({
      header: 'A password reset link has been sent to your email address',
      message: '',
      buttons: [
        {
          text: 'Ok',
          id: 'cancel-button',
          handler: () => {
            alert.dismiss();
          },
        },
      ],
    });

    await alert.present();
  }


}
