/* eslint-disable @typescript-eslint/member-ordering */
import { CookieService } from 'ngx-cookie-service';
import { ProductService } from 'src/app/services/product.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import * as firebase from '@angular/fire/firestore';
import { finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import SwiperCore, {
  Autoplay,
  Keyboard,
  Pagination,
  Scrollbar,
  Zoom,
} from 'swiper';

import { IonicSlides } from '@ionic/angular';

SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom, IonicSlides]);

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  categories = [
    { name: 'Top Categories', selected: true },
    { name: 'Subcaterories', selected: false },
    { name: 'Banner Ads', selected: false },
  ];

  banners: any = [];

  topCategories: any = [];

  subCategory: any = [];

  mainCatForm = new FormGroup({
    category: new FormControl('', Validators.required),
    size: new FormControl(true),
    brand: new FormControl(true),
    image: new FormControl(''),
    id: new FormControl(''),
  });

  subCatForm = new FormGroup({
    category: new FormControl('', Validators.required),
    title: new FormControl(''),
    color: new FormControl(''),
    id: new FormControl(''),
  });

  bannerForm = new FormGroup({
    image: new FormControl('', Validators.required),
    active: new FormControl(true),
    id: new FormControl(''),
    clicks: new FormControl(''),
    owner: new FormControl(''),
  });

  selectedTopCategory: any = {};
  selectedSubCategory: any = {};
  selectedBanner: any = {};
  transparentToolBar = false;
  private slides: any;

  ref!: AngularFireStorageReference;
  task!: AngularFireUploadTask;
  downloadUrl: any;
  uploadProgress!: Observable<any>;
  isUploading = false;

  images: File[] = [];
  imagePath: any = [];
  uploadedImages: any = [];

  user: any;

  constructor(
    private adminService: ProductService,
    private afStorage: AngularFireStorage,
    private afStore: AngularFirestore,
    private cookie: CookieService
  ) {}

  ngOnInit() {
    this.adminService.getDocs('categories').subscribe((res) => {
      this.topCategories = res.map(
        (data) =>
          ({
            ...(data.payload.doc.data() as {}),
            id: data.payload.doc.id,
          } as any)
      );
    });

    this.adminService.getDocs('subcategories').subscribe((res) => {
      this.subCategory = res.map((data) => ({
        ...(data.payload.doc.data() as {}),
        id: data.payload.doc.id,
      }));
    });

    this.adminService.getDocs('banners').subscribe((res) => {
      this.banners = res.map((data) => ({
        ...(data.payload.doc.data() as {}),
        id: data.payload.doc.id,
      }));
    });

    try {
      this.user = JSON.parse(this.cookie.get('userinfo'));
    } catch {}
  }

  onScroll(ev) {
    const offset = ev.detail.scrollTop;
    if (offset > 20) {
      this.transparentToolBar = true;
    } else {
      this.transparentToolBar = false;
    }
  }

  removeStyles(index: number = 0) {
    this.categories.forEach((cat: any, i: number) => {
      if (index !== i) {
        this.categories[i].selected = false;
      } else {
        this.categories[i].selected = true;
      }
    });
  }

  setSwiperInstance(swiper: any) {
    this.slides = swiper;

      this.removeStyles(swiper.ActiveIndex);
  }

  nextSlide(next: number) {
    this.slides.slideTo(next);
  }

  randomColor() {
    const colorIndex = Math.round(Math.random() * 10);
    // eslint-disable-next-line max-len
    const colors = [
      'primary',
      'secondary',
      'danger',
      'dark',
      'primary',
      'secondary',
      'danger',
      'dark',
      'primary',
      'secondary',
      'danger',
      'dark',
    ];
    return colors[colorIndex];
  }

  generateOrderId() {
    let orderId = '#';
    for (let index = 0; index < 5; index++) {
      orderId += String(Math.floor(Math.random() * 100));
    }

    return orderId;
  }

  createTopCategory() {
    if (!this.selectedTopCategory.id) {
      this.mainCatForm.patchValue({ id: this.generateOrderId() });

      this.adminService
        .uploadProduct('categories')
        .add(this.mainCatForm.value)
        .then((product) => {
          product.update({ id: product.id });
          this.getItemId(product.id);
          this.uploadFiles(0, 'categories');
        })
        .catch((error) => {
          console.log(error);
        });

      this.clearForms();
    } else {
      this.updateTopCategory();
    }
  }

  selectTopCat(cat: any) {
    this.selectedTopCategory = cat;
    this.mainCatForm.patchValue(cat);
  }

  updateTopCategory() {
    this.topCategories.forEach((cat, i) => {
      if (cat.id === this.selectedTopCategory.id) {
        //this.topCategories[i] = this.mainCatForm.value;
        this.adminService.updateDoc(
          'categories',
          this.selectedTopCategory.id,
          this.mainCatForm.value
        );
        this.cookie.set('itemId', cat.id);
        this.uploadFiles(0, 'categories');
        if (this.images.length > 0) {
          this.adminService.updateDoc(
            'categories',
            this.selectedBanner.id,
            this.bannerForm.value,
            this.selectedBanner.image
          );
        } else {
          this.adminService.updateDoc(
            'categories',
            this.selectedBanner.id,
            this.bannerForm.value
          );
        }
      }
    });
    this.clearForms();
  }

  //subcategories

  createSubCategory() {
    if (!this.selectedSubCategory.id) {
      this.subCatForm.patchValue({ id: this.generateOrderId() });
      this.subCatForm.patchValue({ color: this.randomColor() });
      this.adminService.createDoc('subcategories', this.subCatForm.value);
      this.clearForms();
    } else {
      this.updateSubCategory();
    }
  }

  selectSubCat(cat: any) {
    this.selectedSubCategory = cat;
    this.subCatForm.patchValue(cat);
  }

  updateSubCategory() {
    this.subCategory.forEach((cat, i) => {
      if (cat.id == this.selectedSubCategory.id) {
        //this.subCategory[i] = this.subCatForm.value;
        this.adminService.updateDoc(
          'subcategories',
          this.selectedSubCategory.id,
          this.subCatForm.value
        );
      }
    });
    this.clearForms();
  }

  deleteSubCategory(id) {
    // let subCats = []
    // this.subCategory.forEach((cat, i) => {
    //   if (cat.id == id) {
    // subCats.push(cat);

    this.adminService.deleteDoc('subcategories', id);
    //   }
    // });

    //this.subCategory = subCats
  }

  //Banner
  createBanner() {
    if (!this.selectedBanner.id) {
      this.bannerForm.patchValue({ id: this.generateOrderId() });
      //this.adminService.createDoc('banners', this.bannerForm.value);
      this.adminService
        .uploadProduct('banners')
        .add(this.bannerForm.value)
        .then((product) => {
          product.update({ id: product.id });

          this.getItemId(product.id);
          this.uploadFiles(0, 'banners');
        })
        .catch((error) => {
          console.log(error);
        });
      // this.clearForms();
    } else {
      this.updateBanner();
    }
  }

  selectBanner(banner: any) {
    this.selectedBanner = banner;
    this.bannerForm.patchValue(banner);
  }

  updateBanner() {
    this.banners.forEach((banner, i) => {
      if (banner.id === this.selectedBanner.id) {
        // this.banners[i] = this.bannerForm.value;
        this.cookie.set('itemId', banner.id);
        this.uploadFiles(0, 'banners');
        if (this.images.length > 0) {
          this.adminService.updateDoc(
            'banners',
            this.selectedBanner.id,
            this.bannerForm.value,
            this.selectedBanner.image
          );
        } else {
          this.adminService.updateDoc(
            'banners',
            this.selectedBanner.id,
            this.bannerForm.value
          );
        }
      }
    });
    this.clearForms();
  }

  deleteBanner(id, image) {
    // this.banners.forEach((banner, i) => {
    //   if (banner.id == id) {
    this.adminService.deleteDoc('banners', id, image);
    //   }
    // });
  }

  getItemId(id: string): void {
    this.cookie.set('itemId', id);
  }

  selectFiles(id: string): void {
    const fileInput = document.getElementById(id);
    if (fileInput) {
      fileInput.click();
    }
  }

  filesSelected(event: Event): void {
    const files = event.target as HTMLInputElement;
    if (files) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let file = 0; file < files.files.length; file++) {
        this.images.push(files.files[file]);
        // console.log(this.images);
        /// this.previewImages(files.files[file]);
       
      }
    }
  }

  uploadFiles(fileCount: number = 0, location: string): void {
    if (this.images.length > 0) {
      this.isUploading = true;
      const image = this.images[fileCount];
      const path = `/${location}/_${Date.now()}_${image.name}`;
      this.ref = this.afStorage.ref(path);
      this.task = this.ref.put(image);
      this.uploadProgress = this.task.percentageChanges();
      this.task
        .snapshotChanges()
        .pipe(
          finalize(() => {
            this.downloadUrl = this.ref.getDownloadURL();
            this.downloadUrl.subscribe((imageurl: string) => {
              this.afStore
                .collection(location)
                .doc(this.cookie.get('itemId'))
                .update({
                  image: imageurl,
                });
            });

            this.images = [];
          })
        )
        .subscribe();
    } else {
    }
  }

  whatsaap(){
    // eslint-disable-next-line max-len
    window.location.href='https://wa.me/+2330591971286'+'?text=Hello,AirCart%20I%20want%20my%20banner%20';
  }

  clearForms() {
    this.mainCatForm.reset();
    this.subCatForm.reset();
    this.bannerForm.reset();
    this.selectedSubCategory = {};
    this.selectedTopCategory = {};
    this.selectedBanner = {};
  }
}
