/* eslint-disable @typescript-eslint/naming-convention */
import { ProductService } from 'src/app/services/product.service';
import { CookieService } from 'ngx-cookie-service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit, OnDestroy {
   @Input() order;


  constructor(private router: Router, private alertCtrl: AlertController, private cookie: CookieService, private db: ProductService) {


  }

  ngOnInit() {
    //this.getOrders();

//    this.refreshSub = this.db.refreshData.subscribe(ref => {
//       if(ref){
//        // this.getOrders();
//       }
// });
  }


ngOnDestroy(): void {
  //  this.refreshSub.unsubscribe();
  //  this.ordersSub.unsubscribe();
}

delOrder(id){
this.db.delOrder(this.cookie.get('userDocId'),id);
}

  selectectProduct(order){
 this.order =  order;
  }



updateStatus(status, orderId, itemid){

   if(status === 'delivered'){
     this.db.updateOrderStatus(this.cookie.get('uid'), orderId, itemid, {
       is_delivered: true,
       is_cancelled: false,
       is_pending: false,
     });
  } else  {
     this.db.updateOrderStatus(this.cookie.get('uid'), orderId, itemid, {
      is_delivered: false,
      is_cancelled: true,
      is_pending: false,
    });
  }
}

makeCall(phone: string){
  window.location.href = 'tel:'+phone+'?call';
}

sendMessage(phone: string){
  window.location.href='https://wa.me/'+phone;
}

  formatDate(date: string) {
  try{
    return format(parseISO(date), 'MMM dd yy - hh:mm aaaa');
  }catch{
    return '';
  }
  }
}
