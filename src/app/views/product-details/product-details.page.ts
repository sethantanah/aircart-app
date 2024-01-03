import { ProductService } from './../../services/product.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Share } from '@capacitor/share';

//import { IonAccordionGroup } from '@ionic/angular';
import SwiperCore, {
  Autoplay,
  Keyboard,
  Pagination,
  Scrollbar,
  Zoom,
} from 'swiper';

import { AlertController, IonicSlides } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

SwiperCore.use([Autoplay, Keyboard, Pagination, Scrollbar, Zoom, IonicSlides]);

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit, OnDestroy {
  // @ViewChild(IonAccordionGroup, { static: true }) accordionGroup: IonAccordionGroup;
  window = window;
  addedToCart = false;
  product: any;
  products: any = [];
  tempProducts: any = [];
  subProds: any = '';
  prodSub: any;

  constructor(
    private activeRoute: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private http: HttpClient,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
 try{
  this.product = JSON.parse(this.activeRoute.snapshot.paramMap.get('img'));

  this.getSubCategories();
 }catch{
  const id = this.activeRoute.snapshot.paramMap.get('img');

  this.prodSub = this.productService.getProduct(id).subscribe((data) => {
    this.products = data.map(
      (document: any) =>
        ({
          // eslint-disable-next-line @typescript-eslint/ban-types
          ...(document.payload.doc.data() as {}),
          id: document.payload.doc.id,
        } as any)
    );
   this.product  = this.products[0];
   this.getSubCategories();
  });
 }

  }

  ngOnDestroy(){
    if(this.prodSub){
      this.prodSub.unsubscribe();
    }
    this.subProds.unsubscribe();
   }

   getSubCategories(){
    this.subProds = this.productService
    .getProductBysubCategory('products', this.product.subCategory, 8)
    .subscribe((res) => {
      this.tempProducts = res.map((data: any) => ({
        ...(data.payload.doc.data() as {}),
        id: data.payload.doc.id,
      })
      );

      const prods = [];
      this.tempProducts = this.tempProducts.filter(prod => prod.stock > 0 && prod.softdelete === false);
      this.tempProducts.forEach((prod) => {
        if (prod.id !== this.product.id) {
          prods.push(prod);
        }
      });
      this.products = prods;
    });
   }

  logAccordionValue() {
    // console.log(this.accordionGroup.value);
  }
  closeAccordion() {
    // this.accordionGroup.value = undefined;
  }

  detailsPage(item) {
    this.product = item;

    const prods = [];
    this.tempProducts.forEach((prod) => {
      if (prod.id !== this.product.id) {
        prods.push(prod);
      }
    });
    this.products = prods;
  }
  chat() {
    this.http.post('https://api.whatsapp.com/send?phone=0591971286', 'Hello');
  }

  addProductCart(event, product) {
    const sub = Math.floor(Math.random()*90+1);
    event.stopPropagation();
    this.productService.cartChanges.next(sub);
    this.productService.addToCart(product.id, product.price);
    this.alert();
  }

  removeFromCart(event, product) {
    event.stopPropagation();
    this.productService.removeFromCart(product.id, product.price);
  }

  whatsaap(name, phone) {
    window.location.href =
      'https://wa.me/' +
      phone +
      '?text=I\'m%20interested%20in%20your%20' +
      name +
      '%20for%20sale';
  }


  async alert(){
    const alert = await this.alertCtrl.create({
      header: 'My Cart',
      subHeader: 'The product has been nicely placed in your cart',
      buttons: [
        {
          text: 'Sure, thanks',
          role: 'cancel',
          handler: () => {  }
        },
        {
          text: 'Check out',
          role: 'confirm',
          handler: () => { this. checkout(); }
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
      text: 'Hello, check out this '+ shop.title + ' on Aircart. '+
      `${shop.discount > 0 ? 'Its selling at '+ Math.floor(discount)+ '% discount. ' : 'Its selling for only '+ shop.price+'. '}`,
      url: 'https://aircart.shop/product-details/'+shop.id
    };
     await Share.share(shareData);
    // window.location.href='https://wa.me/'+
    //   '?text=Hello,%20check%20out%20this%20'+ shop.title + '%20on Aircart.%20'+
    //   `${shop.discount > 0 ? '%20Its%20selling%20at%20'+ Math.floor(discount)+ '%'+'%20discount%20' :
    //    '%20Its%20selling%20for%20only%20'+ shop.price}%20` + 'https://aircart.shop/product-details/'+shop.id;
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


}


  checkout() {
    this.router.navigate(['tabs/tab3']);
  }
}
