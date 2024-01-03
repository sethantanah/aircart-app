import { StorageService } from 'src/app/services/storage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../services/product.service';

import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/compat/storage';
import * as firebase from '@angular/fire/firestore';
import { finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import { LoadingController, AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

import { Locations } from '../data-models/locations';

import { Share } from '@capacitor/share';
import { SwPush } from '@angular/service-worker';


class Shop{
  password ='';
  name = '';
  phone='';
  businessName='';
  whatsappLink='';
  accountType='';
  address = '';
  id='';
  cartId='';
 followers = 0;
 following=[];
category='';
tagline='';
about='';
searchField=[];

image='';
}


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy {

  userInfo = new Shop();
  registerForm: FormGroup;



  segmentClass = 'segment-button-checked';
  accountType = 'user';

  ref!: AngularFireStorageReference;
  task!: AngularFireUploadTask;
  downloadUrl: any;
  uploadProgress!: Observable<any>;
  isUploading = false;

  imagesFiles: File[] = [];
  imageURL: any = [];
  uploadedImages: any = [];
  topCategories: any = [];

  userInfoChangedSub: any;
  user = new Shop();;

  loggedIn = false;


  locations: any;
  regions: any;
  selectedRegion: string;
  cities: string[];

  readonly VAPID_PUBLIC_KEY  = 'BIbXy-P55qoRG223gUal3Lc98DEzKOsuZLviOOArXw2XSHnU8JZU_Ppy44aXymWnQGJ905wqblfgv8mF7PPmFAI';


  constructor(private router: Router, private cookie: CookieService,
              private fb: FormBuilder,private db: ProductService,
              private afStorage: AngularFireStorage,
              private afStore: AngularFirestore,
              private authService: AuthService, private productService: ProductService,
              private storageService: StorageService,
              private swPush: SwPush,
              ) {
              //  console.log(this.userInfo)

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


  ngOnInit(){
    this.registerForm = this.fb.group({
      password: ['', [Validators.required]],
      name: ['', [Validators.required]],
      phone: ['+233'],
      email: [''],
      businessName: [''],
      whatsappLink: [''],
      accountType: ['user'],
      address:  [''],
      locality:  [''],
      id: [''],
      cartId: [''],
     followers: [0],
     following:[],
   category: [],
   tagline: [''],
   about: [''],
   searchField: [],
   userDocId: [],
  image: [''],
  token: [''],
  clicks: [0]
    });

    this.getUserData('');

  this.userInfoChangedSub =  this.authService.userupdates.subscribe(res => {
    if(res){
      this.getUserData(res);
    }
  });

  this.productService.getDocs('categories').subscribe(res => {
    this.topCategories = res.map(data =>
      (
        {
          ...(data.payload.doc.data() as {}),
          id: data.payload.doc.id
        } as any
      )
    );
  });

  this.loggedIn = this.cookie.check('userDocId');
  }

  ngOnDestroy(){
   // this.userInfoChangedSub.unsubscribe();
  }




  getUserData(res){
     let id = '';
    if(this.cookie.check('uid')){
       id = this.cookie.get('uid');

    }else{
      id = res;
    }


    this.productService.getUserInfo('users', id).subscribe((doc) => {
      const users = doc.map(data => (
        {
          ...(data.payload.doc.data() as {}),
          id: data.payload.doc.id,
        } as Shop
      ));

     if(users.length>0){
      this.user = users[0];
      this.userInfo = this.user;

      this.storageService.setItem('userName', this.user['name']);
      this.storageService.setItem('MY_CART', this.user['cartId']);
      this.cookie.set('userDocId', this.user['userDocId'], 365);
     }

       if(res.length> 0 ){ this.userInfo.id =  res;};
        this.user['cartId'] = this.cookie.get('MY_CART');
        this.cookie.set('userinfo', JSON.stringify( this.userInfo), 365);

        this.registerForm.patchValue(this.userInfo);
      if (users.length  === 0) {
       try{
        this.userInfo = JSON.parse(this.cookie.get('userinfo'));
        this.registerForm.patchValue(this.userInfo);
       }catch{}
      }
    });

    try{
      if (this.cookie.check('userinfo') && !this.userInfo) {
        this.userInfo = JSON.parse(this.cookie.get('userinfo'));
        this.registerForm.patchValue(this.userInfo);
      }
    }catch{
    }

  this.db.refreshData.subscribe(() => {
    if (this.cookie.check('userinfo')) {
      this.userInfo = JSON.parse(this.cookie.get('userinfo'));
      this.registerForm.patchValue(this.userInfo);
    }

    if (this.cookie.check('userinfo') && this.cookie.check('userDocId')) {
      this.userInfo = JSON.parse(this.cookie.get('userinfo'));
      this.registerForm.patchValue(this.userInfo);
    }
  });


  try{
    if(this.cookie.check('appToken')){
      this.registerForm.patchValue({token: this.cookie.get('appToken')});
    }
  }catch{

  }
  }

  segmentChanged(ev) {
    this.segmentClass = '';
    this.accountType = ev.target.value;

    this.registerForm.patchValue({ accountType: ev.target.value });

  }

  checkUser(){
    if (this.cookie.check('userinfo') && this.cookie.check('userDocId')) {

    } else{
      this.router.navigate(['login']);
    }
  }

  logout(){
    if ( this.cookie.check('userDocId')) {
        this.authService.logout();
        this.loggedIn = false;
        this.router.navigate(['login']);
    } else{
      this.router.navigate(['login']);
    }
  }

  async updateUser(){
      this.registerForm.patchValue({token: this.cookie.get('appToken')});
    this.db.updateUser(this.registerForm.value);
    const userInfo =  this.registerForm.value;
    userInfo.id =  this.cookie.get('uid');
    userInfo.cartId = this.cookie.get('MY_CART');

    this.cookie.set('userinfo', JSON.stringify(userInfo), 365);
    this.userInfo = JSON.parse(this.cookie.get('userinfo'));
  }



  postProduct() {
    this.router.navigate(['upload-product', 'create', JSON.stringify({})]);
  }


  orderHistory() {
    this.router.navigate(['invoice']);
  }

  topProducts(){
    this.router.navigate(['products']);
  }

  toCartPage(event){
    event.stopPropagation();
    this.router.navigate(['tabs/tab3']);
  }

   whatsaap(){
    window.location.href='https://wa.me/+2330591971286';
  }

  selectFiles(): void {

    if (this.cookie.check('userinfo') && this.cookie.check('userDocId')) {
      const fileInput = document.getElementById('pimage-input');
      if (fileInput) {
        fileInput.click();
      }
    } else{
      this.router.navigate(['login']);
    }

  }


  filesSelected(event: Event): void {
    const files = (event.target as HTMLInputElement);
    if (files) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let file = 0; file < files.files.length; file++) {
        this.imagesFiles.push(files.files[file]);
        this.uploadFiles(files.files[file]);
      }
    }
  }




  uploadFiles(file): void {
     this.isUploading = true;
      const path = `/users/_${Date.now()}_${file.name}`;
      this.ref = this.afStorage.ref(path);
      this.task = this.ref.put(file);
      this.uploadProgress = this.task.percentageChanges();
      this.task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadUrl = this.ref.getDownloadURL();
          this.downloadUrl.subscribe((imageurl: string) => {
            this.afStore.collection('users').doc(this.cookie.get('userDocId')).update({
              image: imageurl
            });

            this.updateDp(imageurl);
            this.isUploading = false;
          });

          this.imagesFiles = [];
        })
      ).subscribe();

  }


  updateDp(image){
    if(this.registerForm.value.image.length> 10){
      this.db.deleteFile(this.registerForm.value.image);
    }

    this.registerForm.patchValue({ image });
    const userInfo =  this.registerForm.value;
    userInfo.id =  this.cookie.get('uid');
    userInfo.cartId = this.cookie.get('MY_CART');
    userInfo.image = image;


    this.cookie.set('userinfo', JSON.stringify(userInfo), 365);
    this.userInfo = JSON.parse(this.cookie.get('userinfo'));
  }

  setRegion(region){
    this.selectedRegion = region;
    this.cities = this.locations[region];
    }
  setLocation(city){
    this.registerForm.patchValue({locality: city});
  }

  async share() {
    const shareData = {
      title: 'AirCart',
      text: 'Hello buddy, check out AirCart, they have amazing products at affordable prices and you can start your own shop too.',
      url: 'https://aircart.shop',
    };
     await Share.share(shareData);

    try{

    }catch{
       window.location.href='https://wa.me/'+
      '?text=Hello%20buddy,%20check%20out%20AirCart,%20they%20have%20'+
      'amazing%20products%20at%20affordable%20prices%20and%20you%20can%20start%20your%20own%20shop%20too.'
      +'https://aircart.shop';
    }
  }

  privacyPage(){
    this.router.navigate(['privacy-and-terms-of-use']);
  }

  registrationPage(){
    this.router.navigate(['registration']);
  }
}
