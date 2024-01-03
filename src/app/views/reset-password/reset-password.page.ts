import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AngularFireAuth } from '@angular/fire/compat/auth';

import * as firebase from '@angular/fire/firestore';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { LoadingController, ToastController } from '@ionic/angular';

class FirebaseErrors {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  static Parse(errorCode: string): string {
    let message: string;

    switch (errorCode) {
      case 'auth/wrong-password':
        message = 'Invalid login credentials.';
        break;
      case 'auth/network-request-failed':
        message = 'Please check your internet connection';
        break;
      case 'auth/too-many-requests':
        message =
          'We have detected too many requests from your device. Take a break please!';
        break;
      case 'auth/user-disabled':
        message =
          'Your account has been disabled or deleted. Please contact the system administrator.';
        break;
      case 'auth/requires-recent-login':
        message = 'Please login again and try again!';
        break;
      case 'auth/email-already-exists':
        message = 'Email address is already in use by an existing user.';
        break;
      case 'auth/user-not-found':
        message =
          'We could not find user account associated with the email address or phone number.';
        break;
      case 'auth/phone-number-already-exists':
        message = 'The phone number is already in use by an existing user.';
        break;
      case 'auth/invalid-phone-number':
        message = 'The phone number is not a valid phone number!';
        break;
      case 'auth/invalid-email  ':
        message = 'The email address is not a valid email address!';
        break;
      case 'auth/cannot-delete-own-user-account':
        message = 'You cannot delete your own user account.';
        break;
      default:
        message = 'Oops! Something went wrong. Try again later.';
        break;
    }

    return message;
  }
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  frmSetNewPassword = this.fb.group({
    password: [null, [Validators.required]],
    confirmPassword: [null, [Validators.required]],
  });

  mode: any;
  code: any;
  showpassword = false;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private activatedActivated: ActivatedRoute,
    private route: ActivatedRoute,
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
  ) {}

  ngOnInit() {
    this.mode = this.activatedActivated.snapshot.queryParams['mode'];
    this.code = this.route.snapshot.queryParams['oobCode'];
  }

  async setPassword() {
    const loading = await this.loadingCtrl.create();
    const password = this.frmSetNewPassword.controls['password'].value;
    const confirmPassword =
      this.frmSetNewPassword.controls['confirmPassword'].value;

    if (password !== confirmPassword) {
      // react to error
      this.presentToast('Passwords do not match');
      return;
    } else {
      loading.present();
      this.afAuth
        .confirmPasswordReset(this.code, password.toString())
        .then(() => { loading.dismiss(); this.back();})
        .catch((err) => {
          const errorMessage = FirebaseErrors.Parse(err.code); // check this helper class at the bottom
        });
    }
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


  back(){
    this.router.navigate(['login','signin']);
  }
}
