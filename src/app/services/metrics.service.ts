/* eslint-disable @typescript-eslint/naming-convention */
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import * as firebase from '@angular/fire/firestore';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  INCREMENT = firebase.increment(1);
  DECREMENT = firebase.increment(-1);
  product: any = {};

  constructor(
    private afs: AngularFirestore,
    private cookie: CookieService,
    private afStore: AngularFireStorage,
  ) {


  }

recordClicks(coll, id, title){
this.afs.collection(coll).doc(id).update({
clicks: this.INCREMENT
});



// try{
//  const user = JSON.parse(this.cookie.get('userinfo'));
//  this.afs.collection('clicks').add({
//   metric: 'clicks',
//   collection: coll,
//   item: id,
//   title,
//   user: {
//     name:user.name,
//     id: user.id,
//   },
//   date: Date.now()
// });
// }catch{
//   this.afs.collection('clicks').add({
//     metric: 'clicks',
//     collection: coll,
//     item: id,
//     title,
//     user: {},
//     date: Date.now()
//   });
// }


}

recordSearches(coll, term, found){

  try{
    const user = JSON.parse(this.cookie.get('userinfo'));
    this.afs.collection('searches').add({
    metric: 'searches',
    collection: coll,
    term,
    found,
    user: {
      name:user.name,
      id: user.id,
    },
    date: Date.now()
  });
}catch{
  this.afs.collection('searches').add({
    metric: 'searches',
    collection: coll,
    term,
    found,
    user: {},
    date: Date.now()
  });
}
}


cartsTrack(prod, add, removed, deleted){
  try{
    const user = JSON.parse(this.cookie.get('userinfo'));
    this.afs.collection('cartdata').add({
    metric: 'carts',
    product: prod,
    added: add,
    removed,
    deleted,
    user: {
      name:user.name,
      id: user.id,
    },
    date: Date.now()
  });
}catch{
  this.afs.collection('cartdata').add({
    metric: 'carts',
    product: prod,
    added: add,
    removed,
    deleted,
    user: {},
    date: Date.now()
  });
}
}



checkOuts(orderId){
  try{
    const user = JSON.parse(this.cookie.get('userinfo'));
    this.afs.collection('checkout').add({
    metric: 'checkout',
    orderId,
    user: {
      name:user.name,
      id: user.id,
    },
    date: Date.now()
  });
}catch{
  this.afs.collection('checkout').add({
    metric: 'checkout',
    orderId,
    user: {},
    date: Date.now()
  });
}
}


}
