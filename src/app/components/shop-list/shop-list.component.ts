import { Component, Input, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { MetricsService } from 'src/app/services/metrics.service';


@Component({
  selector: 'app-shop-list',
  templateUrl: './shop-list.component.html',
  styleUrls: ['./shop-list.component.scss'],
})
export class ShopListComponent implements OnInit {
  @Input() shop: any;
  liked = false;

  constructor(private cookie: CookieService, private metrics: MetricsService) { }

  ngOnInit() {
    //console.log(this.shop.id);
    this.checkFollowing();

  }


  checkFollowing(){

    try{
      const shops = JSON.parse(this.cookie.get('userinfo'));
      shops.following.forEach(shop => {
        if(shop === this.shop.docId){
      //   console.log(shop);
          this.liked = true;
        }
      });
    }catch{
     this.liked = false;
    }

  }

  recordMetrics(){
    this.metrics.recordClicks('users', this.shop.id, this.shop.businessName);
  }

}
