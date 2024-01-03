import { AlertController, ToastController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { ProductService } from './../services/product.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnDestroy, OnInit {

products: any = [];
price = 0;
cart = {};

  bundleItems = [
  ];
  image: any = '';
  productsCount = 0;


  productsSub: any;
  countSub: any;
  priceSub: any;

constructor(private productService: ProductService,
   private cookie: CookieService, private router: Router, private toastCtrl: ToastController){}
  ngOnInit() {
    this.productService.loadCart();
   this.priceSub = this.productService.cartChange.subscribe(res => {
      this.price = res;
      this.cookie.set('price', this.price.toString());
      if(res === 0){

      }
    });


  try{
    this.productService.cartChanges.subscribe( res => {
      this.productsSub =  this.productService. getCartItems().pipe(take(res)).subscribe(allProducts => {
       const cartItems = this.productService.cart.value;
       const cartkeys = Object.keys(cartItems);
       cartkeys.forEach((key, i) => {
         if(cartItems[key] < 0){
          delete cartItems[key];
         }
       });


       this.products = allProducts.filter(p => cartItems[p.payload.doc.id]).map(
         product => ({
           ...product.payload.doc.data() as {},
         count: cartItems[product.payload.doc.id],
         // eslint-disable-next-line @typescript-eslint/dot-notation
         prices: cartItems['price'], incart: true}));
       this.productService.cartCount.next(this.products.length);
         this.cookie.set('cartCount', this.products.length, 360);
         this.cookie.set('cartItems', JSON.stringify(this.products));
         this.getPrice(this.products);
     });
   });
  }catch{

  }

 this.countSub =  this.productService.cartCount.subscribe(res =>{
   this. productsCount =  res;
   });
  }



  getPrice(products: any){
  let price = 0;

  products.forEach(prod => {
    price += (prod.price-prod.discount) * prod.count;
  });
  this.price = price;
  this.cookie.set('price', price.toString());
  }



ngOnDestroy(): void {
  this.productsSub.unsubscribe();
  this.countSub.unsubscribe();
  this.priceSub.unsubscribe();
}
  ///this.productService.checkoutCart();

  checkOut(event){
    if (Number(this.cookie.get('cartCount')) > 0){
     event.stopPropagation();
     this.productService.cartChanges.next(4);
     this.router.navigate(['/checkout']);
   }
  else{
    this.presentToast('Add something to your cart');
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


}
