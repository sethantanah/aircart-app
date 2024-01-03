import { format, parseISO } from 'date-fns';
import { ProductService } from 'src/app/services/product.service';
import { CookieService } from 'ngx-cookie-service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import SwiperCore, {
  Autoplay,
  Keyboard,
  Pagination,
  Scrollbar,
  Zoom,
  Navigation,
} from 'swiper';
import { IonicSlides } from '@ionic/angular';
SwiperCore.use([
  Autoplay,
  Keyboard,
  Pagination,
  Scrollbar,
  Zoom,
  Navigation,
  IonicSlides,
]);

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.page.html',
  styleUrls: ['./invoice.page.scss'],
})
export class InvoicePage implements OnInit, OnDestroy {
  segmentClass = 'segment-button-checked';
  orders: any = {};
  activeOrders: any = [];
  completeOrders: any = [];
  slides: any = '';

  ordersSub: any;
  refreshSub: any;
  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private cookie: CookieService,
    private db: ProductService
  ) {}

  ngOnInit() {
    this.getOrders();
    this.refreshSub = this.db.refreshData.subscribe((ref) => {
      if (ref) {
        this.getOrders();
      }
    });
  }

  ngOnDestroy() {
    this.ordersSub.unsubscribe();
    this.refreshSub.unsubscribe();
  }

  getOrders() {
    if (this.cookie.check('uid')) {
      this.ordersSub = this.db
        .getMyOrders(this.cookie.get('uid'))
        .subscribe((res) => {
          this.activeOrders = [];
          this.completeOrders = [];
          this.orders = res.map((data) => ({
            ...(data.payload.doc.data() as {}),
            id: data.payload.doc.id,
          }));
          //console.log(this.orders[1]);
          this.orders.forEach((item) => {
            if (item.is_pending) {
              this.activeOrders.push(item);
            } else {
              this.completeOrders.push(item);
            }
          });
        });
    } else {
      this.router.navigate(['login']);
    }
  }

  segmentChanged(ev) {
    this.segmentClass = '';
    // alert(ev.target.value);
  }

  setSwiperInstance(swiper: any) {
    this.slides = swiper;
  }

  nextSlide(next: number) {
    this.slides.slideTo(next);
  }

  async cancelOrder(event, products, orderId) {
    const alert = await this.alertCtrl.create({
      header: 'Cancel order',
      message: 'Contact vender to cancel the order',
      buttons: [
        {
          text: 'Contact ' + products[0].venderInfo.name,
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            this.cancelMyOrder(
              products[0].title,
              products[0].count,
              products[0].venderInfo,
              orderId,
              products.length
            );
          },
        },
      ],
    });

    await alert.present();
  }

  async track(event, products, orderId) {
    const alert = await this.alertCtrl.create({
      header: 'Track order',
      message: 'Contact vender to know more about your order',
      buttons: [
        {
          text: 'Contact ' + products[0].venderInfo.name,
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            this.trackOrder(
              products[0].title,
              products[0].count,
              products[0].venderInfo,
              orderId,
              products.length
            );
          },
        },
      ],
    });

    await alert.present();
  }

  cancelMyOrder(product, quantity, venderInfo, orderId, more) {
    let msgText = '';
    const text =
      'Hello, I ordered ' +
      quantity +
      ' ' +
      product +
      `${more > 1 ? 'and other items ' : ' '}` +
      ' but I want to cancel my order. My order id is ' +
      orderId.replace('#', '') +
      ' . Thank you.';
    text.split(' ').forEach((t) => {
      msgText += t + '%20';
    });
    //alert(msgText);
    window.location.href =
      'https://wa.me/' + venderInfo.phone + '?text=' + msgText;
  }

  trackOrder(product, quantity, venderInfo, orderId, more) {
    let msgText = '';
    const text =
      'Hello, I ordered ' +
      quantity +
      ' ' +
      product +
      `${more > 1 ? 'and other items, ' : ' '}` +
      'and want to know more about the delivery . My order id is ' +
      orderId.replace('#', '') +
      ' . Thank you';
    text.split(' ').forEach((t) => {
      msgText += t + '%20';
    });
    window.location.href =
      'https://wa.me/' + venderInfo.phone + '?text=' + msgText;
  }

  formatDate(date: string) {
    return format(parseISO(date), 'MMM dd yy - hh:mm aaaa');
  }
}
