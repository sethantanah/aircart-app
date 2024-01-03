import { ProductService } from './../../services/product.service';
import { StorageService } from '../../services/storage.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import firebase  from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

interface User {
  name: string;
  id: string;
  email: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  credentials: FormGroup;
  user: User;
  routeIntent: any;
  routerSub: any;
  userSub: any;

  userEmail ='';
  constructor(
    private aleartCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private db: StorageService,
    private productService: ProductService,
    private cookie: CookieService,
    private navCtrl: NavController,
    private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
  ) {}

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  ngOnInit() {
   // this.auth.logout();
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
try{
  if(this.cookie.check('userinfo')){
    this.userEmail =  JSON.parse(this.cookie.get('userinfo')).email;
    if(this.userEmail.length > 0){
      this.credentials.patchValue({email: this.userEmail});
  }
}
}catch{

}

    this.routerSub = this.activatedRoute.paramMap.subscribe((res) => {
      if (res) {
        this.routeIntent = res;
      }
    });
  }

  ngOnDestroy() {

    if(this.routerSub || this.userSub){
      this.routerSub?.unsubscribe();
      this.userSub?.unsubscribe();
    }

  }


  async googleSignin() {
   // return this.updateUserData(credential.user);
  }


  async login() {
     // const provider =  new firebase.auth.GoogleAuthProvider();
    //  this.afAuth.signInWithPopup(provider)
    const loading = await this.loadingCtrl.create();
    loading.present();
   this.auth
     .login(this.credentials.value.email, this.credentials.value.password)
   .then(async (res) => {
        this.db.setItem('uid', res.user.uid);
        this.userSub = this.productService
          .getUserInfo('users', res.user.uid)
          .subscribe((doc) => {
            const users = doc.map((data) => ({
              ...(data.payload.doc.data() as {}),
              id: data.payload.doc.id,
            }));
            const user = users[0];
            this.db.setItem('userName', user['name']);
            this.db.setItem('MY_CART', user['cartId']);
            this.cookie.set('userDocId', user['userDocId'], 365);

            user.id = res.user.uid;
            user['cartId'] = this.cookie.get('MY_CART');
            this.cookie.set('userinfo', JSON.stringify(user), 365);
          });
        this.auth.userupdates.next(res.user.uid);
        this.productService.refreshData.next(3);
        this.productService.cartChanges.next(1);
        await loading.dismiss();

        if (this.routeIntent.length > 0) {
          this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
        } else {
          this.navCtrl.back();
        }
      })
      .catch(async (err) => {
        await loading.dismiss();
        const aleart = await this.aleartCtrl.create({
          header: 'Could not login',
          message: err.message,
          buttons: ['OK'],
        });
        await aleart.present();
      });
  }

  resetPassword(){
    console.log(this.credentials.value.email)
    this.auth.resetPassword(this.credentials.value.email);
  }
}
