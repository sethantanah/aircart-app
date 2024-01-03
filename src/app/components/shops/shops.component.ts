import { Component, Input, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { MetricsService } from 'src/app/services/metrics.service';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.scss'],
})
export class ShopsComponent implements OnInit {
  @Input() shop: any;
  liked = false;

  constructor(private cookie: CookieService, private metrics: MetricsService) {}

  ngOnInit() {
    // console.log(this.shop.image);
    this.checkFollowing();
  }

  checkFollowing() {
    try {
      const shops = JSON.parse(this.cookie.get('userinfo'));
      shops.following.forEach((shop) => {
        //console.log(shop, this.shop.id);
        if (shop === this.shop.docId) {
          this.liked = true;
        }
      });
    } catch {
      // this.liked = false;
    }
  }

  recordMetrics() {
    this.metrics.recordClicks('users', this.shop.id, this.shop.businessName);
  }
}
