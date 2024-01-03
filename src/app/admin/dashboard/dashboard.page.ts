import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Share } from '@capacitor/share';

import SwiperCore, {
  Autoplay,
  Keyboard,
  Pagination,
  Scrollbar,
  Zoom,
} from 'swiper';

import { AlertController, IonicSlides, ToastController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { ProductService } from 'src/app/services/product.service';

SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom, IonicSlides]);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
  categories = [
    { name: 'Products', selected: true },
    { name: 'Orders', selected: false },
    { name: 'Overview', selected: false },
    { name: 'Activities', selected: false },
  ];
  user: any;
  transparentToolBar = false;

  orders: any = [];
  ordersTemp: any = [];
  order: any = {};

  ordersSub: any;
  refreshSub: any;
  routerSub: any;

  newOrders = 0;
  private slides: any;

  constructor(
    private router: Router,
    private cookie: CookieService,
    private db: ProductService,
    private activatedRoute: ActivatedRoute,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.getOrders();
    this.routerSub = this.activatedRoute.paramMap.subscribe(res => {
      if(res.get('action')){
          const action = res.get('action');
          const details = JSON.parse(res.get('id'));
          if(action === 'update'){
            this.alert('Your product was successfully updated' , 'Tell everyone about it!', details);
          }else{
            this.alert('Your product is live' , 'Tell everyone about it!', details);
          }
      }
    });
    try {
      this.user = JSON.parse(this.cookie.get('userinfo'));
    } catch {}
  }

  ngOnDestroy(): void {
    //  this.refreshSub.unsubscribe();
    this.ordersSub.unsubscribe();
    if(this.routerSub){
      this.routerSub.unsubscribe();
    }
  }

  getOrders() {
    this.newOrders = 0;
    if (this.cookie.check('userDocId')) {
      this.ordersSub = this.db
        .getOrders(this.cookie.get('userDocId'))
        .subscribe((res) => {
          this.orders = res.map((data) => ({
            ...(data.payload.doc.data() as {}),
            id: data.payload.doc.id,
          }));

          this.orders.forEach(order => {
            this.ordersTemp.push(order);
          });

          this.orders = this.ordersTemp;
          this.ordersTemp = [];

          this.orders.map((order) => {
            order.product = order.products[0];
          });

          this.orders.forEach((order, i) => {
           // console.log(order.is_delivered);
            if (order.is_delivered === false && order.is_cancelled === false) {
              this.newOrders += 1;
            }
          });
        });
    } else {
      this.router.navigate(['login']);
    }
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
  }

  postProduct() {
    this.router.navigate(['upload-product', 'create', JSON.stringify({})]);
  }

  createCategory() {
    this.router.navigate(['categories']);
  }

  createAds() {
    this.router.navigate(['tabs/tab1']);
  }

  nextSlide(next: number) {
    this.slides.slideTo(next);
    this.removeStyles(next);
  }


  async alert(title , message, shop){
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: message,
      buttons: [
        {
          text: 'Sure, Thanks',
          role: 'cancel',
          handler: () => { if(this.routerSub){
            //this.routerSub.unsubscribe();
          } }
        },
        {
          text: 'Share',
          role: 'confirm',
          handler: () => {
            this.share(shop);
           }
        }
      ],
      backdropDismiss: true,
      translucent: true,
      animated: true,
    });
    await alert.present();
  }





  async share(shop) {
    const discount = (shop.discount/shop.price)*100;
    const shareData = {
      title: shop.title,
      text: 'Hello, check out our '+ shop.title + ' on Aircart. '+
      `${shop.discount > 0 ? 'Its selling at '+ Math.floor(discount)+ '% discount' : 'Its selling for only '+ shop.price}` + '.'+
      'https://aircart.shop/product-details/'+ shop.id +
      '\n We have more products for your in our shop too '+ 'https://aircart.shop/shops-details/'+shop.shopid,
      url: 'https://aircart.shop/product-details/'+ shop.id,
    };
     await Share.share(shareData);
    // window.location.href='https://wa.me/'+
    //   '?text=Hello,%20check%20out%20our%20'+ shop.title + '%20on Aircart.%20'+
    //   `${shop.discount > 0 ? '%20Its%20selling%20at%20'+ Math.floor(discount)+ '%'+'%20discount%20' :
    //    '%20Its%20selling%20for%20only%20'+ shop.price}%20` + 'https://aircart.shop/product-details/'+shop.id+
    //   '\n%20We%20have%20more%20products%20for%20your%20in%20our%20shop%20too%20'+ 'https://aircart.shop/shops-details/'+shop.shopid;
    try{

    }catch{
       await navigator.share(shareData);
    //   await Share.share({
    //     title: shopName,
    //     text: 'Hello, i am inviting you to visit my shop on AirKart. I have  some amazing products for you.',
    //     url: 'https://aircart.shop/shops-details/'+shopUrl,
    //     dialogTitle: 'Share with buddies',
    //   });
    // }
  }

  if(this.routerSub){
    //this.routerSub.unsubscribe();
  }
}










  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      mode: 'ios',
      duration: 1000,
      position: 'top',
      color: 'primary',
      icon: 'cart',
    });

    await toast.present();
  }
}
