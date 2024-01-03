import { ProductService } from './../../services/product.service';
import { StorageService } from './../../services/storage.service';
import { CookieService } from 'ngx-cookie-service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  LoadingController,
  AlertController,
  NavController,
} from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Locations } from '../../data-models/locations';

const UID_KEY = 'uid';
const USER_INFO = 'userinfo';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit, OnDestroy {
  segmentClass = 'segment-button-checked';
  accountType = 'user';
  topCategories: any = [];

  routeIntent: any;
  routerSub: any;
  userSub: any;

  locations: any;
  regions: any;
  selectedRegion: string;
  cities: string[];

  registerForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private db: StorageService,
    private productService: ProductService,
    private cookie: CookieService,
    private navCtrl: NavController
  ) {
    this.locations = new Locations();
    this.locations = this.locations.locations;
    this.regions = Object.keys(this.locations);
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }
  get name() {
    return this.registerForm.get('name');
  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      name: ['', [Validators.required]],
      phone: ['+233'],
      businessName: [''],
      whatsappLink: [''],
      accountType: ['user'],
      address: [''],
      locality: [''],
      id: [''],
      cartId: [''],
      followers: [0],
      following: [],
      category: [],
      tagline: [''],
      about: [''],
      admin: [false],
      searchField: [],

      image: [''],
      token: [''],
      userDocId: [],
      clicks: [0],
    });

    this.productService.getDocs('categories').subscribe((res) => {
      this.topCategories = res.map(
        (data) =>
          ({
            ...(data.payload.doc.data() as {}),
            id: data.payload.doc.id,
          } as any)
      );
    });

    this.routerSub = this.activatedRoute.paramMap.subscribe((res) => {
      if (res) {
        this.routeIntent = res;
      }
    });

    try{
      if(this.cookie.check('appToken')){
        this.registerForm.patchValue({token: this.cookie.get('appToken')});
      }

    }catch{

    }
  }

  ngOnDestroy() {
    if( this.routerSub){
      this.routerSub.unsubscribe();

    }if( this.userSub){
      this.userSub.unsubscribe();
    }
  }

  segmentChanged(ev) {
    this.segmentClass = '';
    this.accountType = ev.target.value;

    this.registerForm.patchValue({ accountType: ev.target.value });
  }

  async register() {
    const loading = await this.loadingCtrl.create();
    await loading.present();

    this.auth
      .register(
        this.registerForm.value.email,
        this.registerForm.value.password,
        this.registerForm.value.name
      )
      .then(async (res) => {
        const checkStatus = this.cookie.check('userName');
        const userInfo = this.registerForm.value;
        userInfo['password'] = '';
        if(checkStatus){
          userInfo['cartId'] = '';
          this.cookie.set('MY_CART', null);
          this.cookie.set('userinfo', JSON.stringify({}));
          this.cookie.deleteAll('/', 'https://aircart.shop');
        }else{
          this.cookie.set('userinfo', JSON.stringify({}));
          userInfo['cartId'] = this.cookie.get('MY_CART');
          this.cookie.deleteAll('/', 'https://aircart.shop');
          this.cookie.set('MY_CART', userInfo['cartId']);

        }



        this.db.setItem(UID_KEY, res.user.uid);
        userInfo['id'] = res.user.uid;
        userInfo['userDocId'] = res.user.uid;
        this.db.setItem('userName', this.registerForm.value.name);
        this.productService
          .createRecord('users', userInfo, 'User')
          .then((product) => {
            this.cookie.set('userinfo', JSON.stringify(userInfo), 365);
          });
        this.auth.userupdates.next(res.user.uid);
        this.productService.refreshData.next(4);
        await loading.dismiss();
        if (this.routeIntent.length > 0) {
          this.router.navigateByUrl('/', { replaceUrl: true });
        } else {
          this.navCtrl.back();
        }
      })
      .catch(async (err) => {
        await loading.dismiss();
        const alert = await this.alertCtrl.create({
          header: 'Registration Failed',
          message: err.message,
          buttons: ['OK'],
        });
        alert.present();
      });
  }



  setRegion(region){
    this.selectedRegion = region;
    this.cities = this.locations[region];
    }
  setLocation(city){
    this.registerForm.patchValue({locality: city});
  }
}
