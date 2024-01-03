import { CookieService } from 'ngx-cookie-service';
import { ProductService } from './../../services/product.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent implements OnInit {
@Input() product: any;
image = '';
price = 0;
  constructor(private productService: ProductService, private cookie: CookieService) { }

  ngOnInit() {
    this.image = this.product.images[0];
    this.price = Number(this.cookie.get('price'));
  }


  addToCart(event, product) {
    this.price = Number(this.cookie.get('price'));
    const price = (product.count)*(product.price-product.discount);
    const priceDiff = this.price - (product.count - 1) * (product.price - product.discount);
    this.price = priceDiff + price;
    this.cookie.set('price', this.price.toString());
    this.productService.cartChange.next(priceDiff + price);
    event.stopPropagation();
    this.productService.addToCart(product.id, price);
  }

  removeFromCart(event, product) {
    if (product.count === 0 || product.count-1 <= 0){
     const count = Number(this.cookie.get('cartCount'));
     this.cookie.set('cartCount', (count - 1).toString());
     this.productService.cartCount.next(count-1);
   }
    this.price = Number(this.cookie.get('price'));
    const price = product.count * (product.price - product.discount);
    const priceDiff = this.price - (product.count + 1) * (product.price - product.discount);
    this.price = priceDiff + price;
    this.cookie.set('price', this.price.toString());
    this.productService.cartChange.next(priceDiff + price);
  event.stopPropagation();
    this.productService.removeFromCart(product.id, price);
  }




  deleteItem(product){
    this.productService.deleteItem(product.id);
    this.price = Number(this.cookie.get('price'));

    const price = product.count * (product.price - product.discount);
    this.price = this.price - price;
    const count = Number(this.cookie.get('cartCount'));
    this.cookie.set('cartCount', (count - 1).toString());
    this.productService.cartCount.next(count - 1);
    this.cookie.set('price', this.price.toString());
    this.productService.cartChange.next(this.price);
  }






}
