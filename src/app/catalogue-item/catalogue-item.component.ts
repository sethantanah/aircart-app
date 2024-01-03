import { ToastController } from '@ionic/angular';
import { ProductService } from './../services/product.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-catalogue-item',
  templateUrl: './catalogue-item.component.html',
  styleUrls: ['./catalogue-item.component.scss'],
})
export class CatalogueItemComponent implements OnInit {
  @Input() product: any = {};
  image: string;

   constructor(private productService: ProductService, private toastCtrl: ToastController) { }

   ngOnInit() {
     this.image = this.product.images[0];
   }
   addToCart(event, product) {
    const sub = Math.floor(Math.random()*40+1);

     event.stopPropagation();
     this.productService.cartChanges.next(sub)
     this.productService.addToCart(product.id, product.price);
       this.presentToast('Item has been added to your cart');
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
