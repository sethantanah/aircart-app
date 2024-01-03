import { Router } from '@angular/router';
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
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.scss'],
})
export class PostProductComponent implements OnInit {

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
    {
      category: 'fashion',
      title: 'Shoes'
    },
    {
      category: 'food',
      title: 'Fried Rice'
    },
    {
      category: 'Electronics',
      title: 'Hp Laptop'
    }
  ];
  categoryChanged = false;

  filetrsubCategory: any = [

  ];

  selectedCategory: any = {};
  product: Product;
  productSub: any;
  itemId: string;











  productForm = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl( Validators.required),
    discount: new FormControl(),
    sizes: new FormControl(''),
    negotiable: new FormControl(false),
    category: new FormControl(''),
    subCategory: new FormControl(''),
    quantity: new FormControl(''),
    available: new FormControl(true),
    images: new FormControl([]),
    venderId: new FormControl(''),
    id: new FormControl(''),
    softdelete: new FormControl('false')
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
  imageCount: Observable<number> = of(0);

  private slides: any;

  ;

  userId = '';

  // customPopoverOptions: any = {
  //   header: 'Hair Color',
  //   subHeader: 'Select your hair color',
  //   message: 'Only select your dominant hair color'
  // };

  // customActionSheetOptions: any = {
  //   header: 'Colors',
  //   subHeader: 'Select your favorite color'
  // };
  constructor(private afStorage: AngularFireStorage, private productService: ProductService,
    private cookie: CookieService, private afStore: AngularFirestore, private router: Router) {
    this.userId = this.cookie.get('uid');
  }

  ngOnInit(): void {

  }
  setSwiperInstance(swiper: any) {
    this.slides = swiper;
  }

  nextSlide(next: number) {
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

   // console.log(this.images, this.imagePath);
  }



  previewImages(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const path = reader.result as string;
      this.imagePath.push(path);
      console.log(path);
    };
    reader.readAsDataURL(file);
  }

  removeImage(index: number) {
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



  async uploadProductItem() {
    this.productForm.patchValue({ venderId: this.userId });
    await this.productService.uploadProduct('products').add(this.productForm.value).then(product => {
      product.update({ id: product.id });
      this.productForm.reset();
      this.getItemId(product.id);
    }).catch(error => {
      console.log(error);
    });

    this.imageCount.subscribe(count => {
      this.uploadFiles(count);
    });
  }

  getItemId(id: string): void {
    this.cookie.set('itemId', id);
  }



  uploadFiles(fileCount: number = 0): void {
    this.isUploading = true;
    if (this.images.length > 0) {
      const image = this.images[fileCount];
      const path = `/product/_${Date.now()}_${image.name}`;
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
    if ((count + 1) == (this.images.length)) {
      this.router.navigate(['tabs/tab1']);
      this.isUploading = false;
    }
  }



}
