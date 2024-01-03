/* eslint-disable @typescript-eslint/ban-types */
import { ProductService } from './../services/product.service';
/* eslint-disable max-len */
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import SwiperCore, {
  Autoplay,
  Keyboard,
  Pagination,
  Scrollbar,
  Zoom,
  Navigation,
  SwiperOptions,
  EffectFade,
} from 'swiper';

import { IonicSlides } from '@ionic/angular';
import { MetricsService } from '../services/metrics.service';

SwiperCore.use([
  Autoplay,
  Keyboard,
  Pagination,
  Scrollbar,
  Zoom,
  Navigation,
  EffectFade,
  IonicSlides,
]);

interface Product {
  title: string;
  description: string;
  nutrition?: string;
  category: string;
  subCategory: string;
  price: number;
  discount: number;
  sizes?: string[];
  images?: string[];
  quantity?: string;
  available?: boolean;
  negotiable?: boolean;
  id: string;
}

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit, OnDestroy {
  @Input() name: string;

  config: SwiperOptions = {
    autoplay: {
      delay: 3200,
      disableOnInteraction: false,
    },
    // pagination: {
    //   el: '.swiper-pagination',
    //   clickable: true,
    // },
    // navigation: {
    //   navigation:true,
    //   nextEl: '.swiper-button-next',
    //   prevEl: '.swiper-button-prev',
    // },
    slidesPerView: window.outerWidth > 540 ? 3 : 1,
    centeredSlides: true,
    navigation: true,
    spaceBetween: 10,
    keyboard: true,
    pagination: true,
    scrollbar: false,
    zoom: true,
  };

  categories = [];

  banners = [];

  products: Product[] = [];
  allProducts: Product[] = [];

  instantFoods: Product[] = [];
  beverages: Product[] = [];
  stationary: Product[] = [];
  electronics: Product[] = [];
  selfcare: Product[] = [];
  fashion: Product[] = [];


  prodSub: any;

  users = [];
  userSub: any;

  noproducts = false;
  timer: any;

  constructor(
    private router: Router,
    private db: ProductService,
    private loadingController: LoadingController,
    private metrics: MetricsService
  ) {}

  ngOnInit() {
    this.setTimer();
    this.prodSub = this.db.getProducts().subscribe((data) => {
      this.products = data.map(
        (document: any) =>
          ({
            // eslint-disable-next-line @typescript-eslint/ban-types
            ...(document.payload.doc.data() as {}),
            id: document.payload.doc.id,
          } as Product)
      );
      this.allProducts = this.products.slice(4);
      this.products = this.products.slice(0, 4);
      this.instantFoods = [];
      this.beverages = [];
      this.selfcare = [];
      this.electronics = [];
      this.stationary = [];
      this.fashion = [];

      this.allProducts.forEach( product => {

        if(product.subCategory === 'instant foods'){

          this.instantFoods.push(product);
        }else if(product.subCategory.trim() === 'beverages'){
          this.beverages.push(product);
        }
        else if(product.category.trim() === 'electronics'){
          this.electronics.push(product);
        }
        else if(product.category.trim() === 'stationary'){
          this.stationary.push(product);
        }
        else if(product.category.trim() === 'selfcare'){
          this.selfcare.push(product);
        }
        else if(product.category.trim() === 'fashion'){
          this.fashion.push(product);
        }
      });


      this.stopTimer();
    });

    this.db.getDocs('categories').subscribe((res) => {
      this.categories = res.map(
        (data) =>
          ({
            ...(data.payload.doc.data() as {}),
            id: data.payload.doc.id,
          } as any)
      );
    });

    this.userSub = this.db.getUsers('users').subscribe((res) => {
      this.users = res.map(
        (data) =>
          ({
            ...(data.payload.doc.data() as {}),
            id: data.payload.doc.id,
            docId: data.payload.doc.id,
          } as any)
      );
    });

    this.db.getDocs('banners', true).subscribe((res) => {
      this.banners = res.map((data) => ({
        ...(data.payload.doc.data() as {}),
        id: data.payload.doc.id,
      }));
    });
  }

  toProductsPage(banner) {
    if (banner.owner) {
    this.recordClicks(banner.id, banner.owner);
      this.router.navigate(['/shops-details', banner.owner]);
    } else {
     this.recordClicks(banner.id, '');
      this.router.navigate(['products']);
    }

  }

  viewAllProducts() {
    this.router.navigate(['products', 'Shopping']);
  }

  offersPage(category) {
    this.router.navigate(['bundle-offers', category.category]);
  }
  detailsPage(product: any) {
    this.router.navigate(['/product-details', JSON.stringify(product)]);
  }

  toShopsPage() {
    this.router.navigate(['/shops']);
  }

  toshopDetails(shopId: string) {
    this.router.navigate(['/shops-details', shopId]);
  }

  setTimer() {
    let time = 0;
    this.timer = window.setInterval(() => {
      time += 1;
      //  console.log(time);
      if (time === 20) {
        this.noproducts = true;
      }
    }, 1000);
  }

  stopTimer() {
    this.noproducts = false;
    window.clearInterval(this.timer);
  }

  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: null,
      duration: 5000,
      message: 'Click the backdrop to dismiss early...',
      translucent: true,
      cssClass: 'custom-class custom-loading',
      backdropDismiss: true,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed with role:', role);
  }

  recordClicks(id, title){
    this.metrics.recordClicks('banners', id, title);
  }

  ngOnDestroy(): void {
    this.prodSub.unsubscribe();
  }
}
