/* eslint-disable @typescript-eslint/naming-convention */
import { ProductService } from './../../services/product.service';
import { FormGroup, FormControl } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';
import { IonDatetime, IonInput, LoadingController, AlertController, NavController  } from '@ionic/angular';
import { Router } from '@angular/router';
import * as firebase from '@angular/fire/firestore';
//import { format, parseISO } from 'date-fns';



interface Order{
  products: [];
  orderer: string;
  location: string;
  address: string;
  phone: string;
  time: string;
  orderDate: string;
  payment: string;
  is_delivered: boolean;
  is_cancelled: boolean;
  is_pending: boolean;
  orderId: string;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {


  deliveryLocations = [
    {
      loc: 'Hostel',
      id: 'hostel',
      address: 'Hilder hostel - room 34',
      phone: '+233',
      active: true
    },
    {
      loc: 'Class',
      id: 'class',
      address: 'MRT 4',
      phone: '+233',
      active: false
    },
    {
      loc: 'Home',
      id: 'home',
      address: 'home address',
      phone: '+233',
      active: false
    },
    {
      loc: 'Office',
      id: 'office',
      address: 'office location',
      phone: '+233',
      active: false
    }
  ];

  //Form to represent an order
  order: Order = {
    products: [],
    orderer: '',
    location: '',
    address: '',
    phone: '',
    time: '',
    payment: '',
    orderDate: new Date().toISOString(),
    is_delivered: false,
    is_cancelled: false,
    is_pending: true,
    orderId: ''
  };


  // Fom to collect a an orderers information

  orders = new FormGroup(
  {
    orderer: new FormControl(''),
    location: new FormControl(''),
    address: new FormControl(''),
    phone: new FormControl(''),
    time: new FormControl(''),
    payment: new FormControl('')
  }
  );


  selectedLoc: any = this.deliveryLocations[0];
  price = 0;
  cartItems = 0;

  constructor(private cookie: CookieService,private productService: ProductService, private router: Router) {

    if (this.cookie.check('location')){
      if (this.cookie.get('location').length>0){
       this.deliveryLocations = JSON.parse(this.cookie.get('location'));
     }
    }
  }

  ngOnInit() {

    //Preload saved user data
    this.price = Number(this.cookie.get('price'));
    this.cartItems = Number(this.cookie.get('cartCount'));



    this.productService.getUser('users', this.cookie.get('uid')).subscribe( data => {

      if (data.docs[0].get('locations')?.length>0){
          this.deliveryLocations = data.docs[0].get('locations');
        this.cookie.set('location', JSON.stringify(this.deliveryLocations));
       }

     });

    this.selectedLoc = this.deliveryLocations[0];
    this.orders.patchValue({ address: this.deliveryLocations[0].address });
    this.orders.patchValue({ phone: this.deliveryLocations[0].phone });
  }


  // Change delivery location
  toogleLoc(locs: any){
    this.selectedLoc = locs;
    this.orders.patchValue({location: locs.loc});
  this.deliveryLocations.forEach(loc => {
    if(loc.id === locs.id){
      loc.active = true;

    this.orders.patchValue({address: loc.address});
    this.orders.patchValue({phone: loc.phone});
    }
    else{
      loc.active = false;
    }

  });
  }

  updateLoc(address: any = this.orders.value.address || '', phone: any = this.orders.value.phone || ''){
    this.deliveryLocations.forEach(loc =>{
      if(loc.id === this.selectedLoc.id){

           loc.address = address;

           loc.phone = phone;


      }
    });


  }


// Payment option selection
  payOptions(option: string){
  this.orders.patchValue({payment: option});
  }


  processCartItems(){
    const items = JSON.parse(this.cookie.get('cartItems'));
    return items;
  }

  // Generate an Id for each order
  generateOrderId(){
    let orderId = '#';
    for (let index = 0; index < 5; index++) {
      orderId += String(Math.floor(Math.random() * 100));
    }
    return orderId;
  }

  // Send Order items to respective selers

  despatchOrders(order, orderid){
    order.products.forEach(prod => {
  const myOrders =  {
        ordererInfo: this.orders.value,
        product: prod,
        orderId: orderid,
        orderDate: new Date().toISOString(),
        is_delivered: false,
        is_cancelled: false,
        is_pending: true,
        venderId: prod.venderInfo.id,
        timestamp: firebase.serverTimestamp(),
      };

      const venderInfo = prod.venderInfo;
      this.productService.dispatchOrders(venderInfo.id, myOrders);
      //this.cookie.set('storeOrders', JSON.stringify(myOrders))
    });



  }


  sendOrder(event){
  event.stopPropagation();
   if(this.cookie.check('uid')){

   this.orders.patchValue({orderer: this.cookie.get('userName')});
     const orderid = this.generateOrderId();
     const prods = this.processCartItems();
     const order = {
       ordererInfo: this.orders.value,
       products: prods,
       price: this.price,
       orderId: orderid,
       orderDate: new Date().toISOString(),
       is_delivered: false,
       is_cancelled: false,
       is_pending: true,
       timestamp: firebase.serverTimestamp(),
       ownerId: this.cookie.get('uid'),
     };
     this.despatchOrders(order, orderid);

    // this.cookie.set('orderss', JSON.stringify(order))
     this.productService.checkoutCart(order);
     this.cookie.set('price', '0');
     this.cookie.set('cartCount','0');
     this.cookie.set('cartItems', JSON.stringify({}));
     this.productService.cartChanges.next(3);
     this.productService.updateUserLocation(this.deliveryLocations);
   }else{
    this.router.navigate(['login']);

   }






  }

  // formatDate(value: string) {
  //   return format(parseISO(value), 'MMM dd yyyy');
  // }

  // editLocation(){

  // }


  backTocart(){
    this.router.navigate(['tabs/tab3']);
  }
}
