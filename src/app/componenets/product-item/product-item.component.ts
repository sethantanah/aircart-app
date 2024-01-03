import { ToastController } from '@ionic/angular';
import { ProductService } from '../../services/product.service';
import { Component, Input, OnInit } from '@angular/core';
import { MetricsService } from 'src/app/services/metrics.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit {
  @Input() product: any = {};
  image ='';

  constructor(
    private productService: ProductService,
    private toastCtrl: ToastController,
    private metrics: MetricsService
  ) {}

  ngOnInit() {
    this.image = this.product.images[0];
  }

  addToCart(event, product) {
    const sub = Math.floor(Math.random()*30+1);
    event.stopPropagation();
    this.productService.cartChanges.next(product.order);
    this.productService.addToCart(product.id, product.price);
    this.presentToast('Item has been added to your cart');
  }

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      mode: 'ios',
      duration: 3000,
      position: 'top',
      color: 'primary',
      icon: 'cart',
    });

    await toast.present();
  }

  recordMetrics(){
    this.metrics.recordClicks('products', this.product.id, this.product.title);
  }
}
