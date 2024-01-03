import { LoadingController, PopoverController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
/* eslint-disable max-len */
import { CookieService } from 'ngx-cookie-service';
import { ProductService } from './../../services/product.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/compat/storage';
import * as firebase from '@angular/fire/firestore';
import { finalize } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

import SwiperCore, { Autoplay, Keyboard, Pagination, Scrollbar, Zoom } from 'swiper';

import { IonicSlides } from '@ionic/angular';

SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom, IonicSlides]);

interface Product {
  title: string;
  description: string;
  nutrition?: string;
  category: string;
  price: number;
  discount: number;
  sizes?: string;
  images?: string[];
  quantity?: string;
  available?: boolean;
  negotiable?: boolean;
}




@Component({
  selector: 'app-upload-product',
  templateUrl: './upload-product.page.html',
  styleUrls: ['./upload-product.page.scss'],
})
export class UploadProductPage implements OnInit {

  sizes = [];
  topCategories: any = [
    {
      category: 'fashion',
      size: true,
      brand: true
    },
    {
      category: 'food',
      size: true,
      brand: false
    },
    {
      category: 'electronics',
      size: true,
      brand: true
    },
  ];

  subCategory: any = [
    // {
    //   category: 'fashion',
    //   title: 'Shoes'
    // },
    // {
    //   category: 'food',
    //   title: 'Fried Rice'
    // },
    // {
    //   category: 'Electronics',
    //   title: 'Hp Laptop'
    // }
  ];
  categoryChanged = false;

  filetrsubCategory: any = [

  ];

  selectedCategory: any = {};
  product: Product;
  productSub: any;
  itemId: string;
  userInfo: any = {};











  productForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    discount: new FormControl(''),
    sizes: new FormControl(''),
    negotiable: new FormControl(false),
    category: new FormControl(),
    subCategory: new FormControl(),
    available: new FormControl(true),
    stock: new FormControl(1),
    lastUpdate: new FormControl(),
    searchField: new FormControl(),
    followers: new FormControl([]),
    clicks: new FormControl(0),

    images: new FormControl([]),
    venderId: new FormControl(''),
    venderInfo: new FormControl(),
    id: new FormControl(''),
    softdelete: new FormControl(false),
    order: new FormControl(0)
  });

  negotiable = false;



  venderForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    category: new FormControl(''),
    email: new FormControl(''),
    location: new FormControl(''),
    phone: new FormControl(''),
  });


  ref!: AngularFireStorageReference;
  task!: AngularFireUploadTask;
  downloadUrl: any;
  uploadProgress!: Observable<any>;
  isUploading = false;

  images: File[] = [];
  imagePath: any = [];
  uploadedImages: any = [];
  imageCount: Observable<number> = of(0);





  userId = '';



  routeAction = '';
  productInfo: any = {};
  productOrder = 0;
  private slides: any;




  constructor(private afStorage: AngularFireStorage, private productService: ProductService,
    private cookie: CookieService, private afStore: AngularFirestore, private router: Router, private activeRoute: ActivatedRoute,
    private loadingCtrl: LoadingController, ) {
    this.userId = this.cookie.get('uid');
    if (this.cookie.check('userinfo')) {
      this.userInfo = JSON.parse(this.cookie.get('userinfo'));
      //console.log(this.userInfo);
    } else {
      router.navigate(['login']);
    }

  }


  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe(obs => {
      this.routeAction = obs.get('action');
      if (this.routeAction === 'edit') {
        this.productForm.patchValue(JSON.parse(obs.get('product')));
        this.negotiable = this.productForm.value.negotiable;
        this.uploadedImages = this.productForm.value.images;
      }else{
        this.productService.getCollectionLength('products').get().subscribe(snap => {
           this.productForm.patchValue({order:  snap.size+1});
        });
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

    this.productService.getDocs('subcategories').subscribe(res => {
      this.subCategory = res.map(data =>
        (
          {
            ...(data.payload.doc.data() as {}),
            id: data.payload.doc.id
          }
        )
      );
    });


  }
  setSwiperInstance(swiper: any) {
    this.slides = swiper;
  }

  nextSlide(next) {
    this.slides.slideTo(next);
  }

  filterSubCategories(): void {
    this.topCategories.forEach(cat => {
      if (cat.category === this.productForm.value.category) {
        this.selectedCategory = cat;
      }
    });
    this.filetrsubCategory = [];
    this.subCategory.forEach(category => {
      if (category.category === this.productForm.value.category) {
        this.filetrsubCategory.push(category);
      }
    });


  }


  selectFiles(): void {
    const fileInput = document.getElementById('file-input');
    if (fileInput) {
      fileInput.click();
    }
  }


  filesSelected(event: Event): void {
    const files = (event.target as HTMLInputElement);
    if (files) {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let file = 0; file < files.files.length; file++) {
        this.images.push(files.files[file]);
        this.previewImages(files.files[file]);
      }
    }

  }



  previewImages(file) {

    const reader = new FileReader();
    reader.onload = () => {
      const path = reader.result as string;
      this.imagePath.push(path);
     // console.log(path);
    };
    reader.readAsDataURL(file);
  }

  removeImage(index) {
    const fileList = [];
    const imageList = [];
    this.images.forEach((file, i) => {
      if (i !== index) {
        fileList.push(file);
      }
    });

    this.imagePath.forEach((file, i) => {
      if (i !== index) {
        imageList.push(file);
      }
    });

    this.images = fileList;
    this.imagePath = imageList;
  }



  generateSearchField(term){
    return term.trim().toLowerCase().split(' ');
  }

  async uploadProductItem() {
    const loading = await this.loadingCtrl.create();
    loading.present();
    if (this.routeAction === 'edit') {
      this.productForm.patchValue({ venderId: this.userId });
      this.getItemId(this.productForm.value.id);
      this.productForm.patchValue({ lastUpdate: firebase.serverTimestamp() });
      this.productForm.patchValue({
        venderInfo: {
          id: this.userInfo.id, name: this.userInfo.businessName, phone: this.userInfo.phone, email: this.userInfo.email,
          whatsappLink: this.userInfo.whatsappLink
        }
      });
      this.productForm.patchValue({searchField:this.generateSearchField(this.productForm.value.title)});

      await this.productService.uploadProduct('products').doc(this.productForm.value.id).update(
        this.productForm.value
      ).then(product => {

        this.imageCount.subscribe(count => {

          this.uploadFiles(count);
        });
      }).catch(error => {
        alert(error);
      });


    } else if (this.routeAction === 'create') {


      this.productForm.patchValue({ venderId: this.userId });
      this.productForm.patchValue({
        venderInfo: {
          id: this.userInfo.id, name: this.userInfo.businessName, phone: this.userInfo.phone, email: this.userInfo.email,
          whatsappLink: this.userInfo.whatsappLink
        }
      });

      this.productForm.patchValue({ searchField: this.generateSearchField(this.productForm.value.title) });
      await this.productService.uploadProduct('products').add(
        this.productForm.value,
      ).then(product => {
        product.update({ id: product.id, lastUpdate: firebase.serverTimestamp() });
        this.getItemId(product.id);
      }).catch(error => {
        console.log(error);
      });

      this.imageCount.subscribe(count => {
        this.uploadFiles(count);
      });
    }
  }








  getItemId(id: string): void {
    this.cookie.set('itemId', id);
  }



  uploadFiles(fileCount: number = 0): void {

    if (this.images.length > 0) {
      this.isUploading = true;
      const image = this.images[fileCount];
      const path = `/product/_${Date.now()}_${image ? image.name : this.productForm.value.title}`;
      this.ref = this.afStorage.ref(path);
      this.task = this.ref.put(image);
      this.uploadProgress = this.task.percentageChanges();
      this.task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadUrl = this.ref.getDownloadURL();
          this.downloadUrl.subscribe((imageurl: string) => {

            this.uploadHelper(fileCount, imageurl);
          });
        })
      ).subscribe();
    } else {
      this.loadingCtrl.dismiss();
      this.router.navigate(['dashboard', 'update', JSON.stringify({
        id: this.cookie.get('itemId'),
        price: this.productForm.value.price,
        title: this.productForm.value.title,
        discount: this.productForm.value.discount,
        shopid: this.userInfo.id,
        shopname: this.userInfo.businessName
      })]);

      this.productForm.reset();
    }
  }




  uploadHelper(count: number, file: string) {
    const docRef = this.afStore.collection('products').doc(this.cookie.get('itemId')).update({
      images: firebase.arrayUnion(file)
    });

    if (count < this.images.length) {
      this.imageCount = of(count + 1);
      this.imageCount.subscribe(cnt => {
        this.uploadFiles(cnt);
      });
    }
    if ((count + 1) === (this.images.length)) {
      this.router.navigate(['dashboard', 'upload', JSON.stringify({
        id: this.cookie.get('itemId'),
        price: this.productForm.value.price,
        name: this.productForm.value.title,
        discount: this.productForm.value.discount,
        shopid: this.userInfo.id,
        shopname: this.userInfo.businessName
      })]);
      this.images = [];
      this.imageCount = of(0);
      this.productForm.reset();
      this.loadingCtrl.dismiss();
      this.isUploading = false;
    }
  }




  deleteImage(imageId) {
   try{
    this.productService.deleteFile(imageId);
    const imagePaths = [];
    this.uploadedImages.forEach(img => {
      if (img !== imageId) {
        imagePaths.push(img);
      }
    });

    this.uploadedImages = imagePaths;
    this.productForm.patchValue({ images: imagePaths });
   }catch{

   }

  }
}
