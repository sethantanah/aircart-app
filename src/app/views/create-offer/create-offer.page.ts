import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-offer',
  templateUrl: './create-offer.page.html',
  styleUrls: ['./create-offer.page.scss'],
})
export class CreateOfferPage implements OnInit {


  products =[
    {
      title: 'Rice',
      price: '2099',
      id: 'jighreo'
    },
    {
      title: 'Yam',
      price: '200',
      id: 'ieruoieu'
    },
    {
      title: 'Vegetable',
      price: '20',
      id: "ewiorh"
    }
  ]

  offers = []
  constructor() { }

  ngOnInit() {
  }




addToOffer(product) {
  let offers = [];
  let isOffer = false;
 if(this.offers.length > 0){
   this.offers.forEach((offer, i) => {
    
     if (offer.id !== product.id) {
       offers.push(offer)
     
     }else{
    isOffer = true;
     }
     
   });
   this.offers = offers;
   if(!isOffer){
     this.offers.push(product)
   }
 }else{
   this.offers.push(product)
 }
 
}

}
