/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { take } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import * as firebase from '@angular/fire/firestore';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';

import {
  IonDatetime,
  IonInput,
  LoadingController,
  AlertController,
  NavController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { MetricsService } from './metrics.service';

const CART_STORAGE_KEY = 'MY_CART';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  cart = new BehaviorSubject({});
  cartChange = new BehaviorSubject(0);
  cartChanges = new BehaviorSubject(1);
  cartCount = new BehaviorSubject(0);
  updates = new BehaviorSubject(0);
  refreshData = new BehaviorSubject(0);
  cartKey = null;
  productsCollection: AngularFirestoreCollection;
  INCREMENT = firebase.increment(1);
  DECREMENT = firebase.increment(-1);
  product: any = {};

  constructor(
    private afs: AngularFirestore,
    private cookie: CookieService,
    private afStore: AngularFireStorage,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private metrics: MetricsService
  ) {
    this.cartCount = new BehaviorSubject(
      this.cookie.check('cartCount') ? Number(this.cookie.get('cartCount')) : 0
    );

    firebase
      .enableIndexedDbPersistence(this.afs.firestore)
      .then((suc) => {})
      .catch((error) => {});

    this.loadCart();
    this.productsCollection = this.afs.collection('products', (ref) =>
      ref.where('softdelete', '==', false).where('stock', '>', 0)
    );
  }

  getCartItems(){
    const dbRef = this.afs.collection('products', ref=>ref.where('stock','>',0).where('softdelete', '==', false)).snapshotChanges();
    return dbRef;
  }

  getProducts() {
    // eslint-disable-next-line max-len
    const dbRef = this.afs.collection('products', ref=>ref.where('stock','>',0).where('softdelete', '==', false).limit(20)).snapshotChanges();
    return dbRef;
  }

  getProduct(id) {
    const dbRef = this.afs.collection('products', ref=>ref.where('id','==',id).limit(1)).snapshotChanges();
    return dbRef;
  }

  getMyProducts(venderId: string) {
    const dbRef = this.afs
      .collection('products', (ref) =>
        ref.where('venderId', '==', venderId).where('softdelete', '==', false)
      )
      .snapshotChanges();
    return dbRef;
  }

  getProductByCategory(
    collection: string = 'products',
    condition: string,
    lmt = 25
  ) {
    if (condition === 'All') {
      return this.afs
        .collection(collection, (ref) =>
          ref.where('softdelete', '==', false).orderBy('order','desc').limit(lmt)
        )
        .snapshotChanges();
    } else {
      return this.afs
        .collection(collection, (ref) =>
          ref
            .where('category', '==', condition)
            .where('softdelete', '==', false)
            .limit(lmt)
        )
        .snapshotChanges();
    }
  }

  getProductByCategoryLimit(
    collection: string = 'products',
    start = 0,
    lmt = 10,
    category = 'All'
  ) {



        if(category === 'All'){
          return this.afs
          .collection(collection, (ref) =>
            ref.where('softdelete', '==', false).orderBy('order', 'desc').where('order', '<', start).limit(lmt)
          )
          .snapshotChanges();

        }else{
          return this.afs
          .collection(collection, (ref) =>
            ref.where('category', '==', category).orderBy('order', 'desc').where('order', '<', start).limit(lmt)
          )
          .snapshotChanges();
        }
  }

  getCollectionLength(coll){
    return this.afs.collection(coll);
  }


updateProductsOrder(id, count){
this.afs.collection('prodcuts').doc(id).update({order: count});
}



  getProductBysubCategory(
    collection: string = 'products',
    condition: string,
    lmt = 25
  ) {
    if (condition === 'All') {
      return this.afs
        .collection(collection, (ref) =>
          ref.where('softdelete', '==', false).orderBy('order','desc').limit(30)
        )
        .snapshotChanges();
    } else {
      return this.afs
        .collection(collection, (ref) =>
          ref
            .where('subCategory', '==', condition)
            .where('softdelete', '==', false)
            .limit(lmt)
        )
        .snapshotChanges();
    }
  }


  getProductBysubCategoryLimit(
    collection: string = 'products',
    start = null,
    lmt = null,
    condition
  ) {

      return this.afs
        .collection(collection, (ref) =>
          ref.where('subCategory', '==', condition).orderBy('order', 'desc').where('order', '<', start).limit(lmt)
        )
        .snapshotChanges();

  }









  deleteProduct(id: string) {
    this.afs.collection('products').doc(id).update({ softdelete: true });
    this.afs.collection('deletedProducts').doc(id).update({ softdelete: true });
  }

  uploadProduct(id: string) {
    const dbRef = this.afs.collection(id);
    return dbRef;
  }

  getDocs(collection: string, filter: boolean = false) {
    if (collection === 'banners' && filter) {
      return this.afs
        .collection(collection, (ref) => ref.where('active', '==', true))
        .snapshotChanges();
    } else {
      return this.afs.collection(collection).snapshotChanges();
    }
  }


  getShops(collection: string, filter: boolean = false) {

      return this.afs
        .collection(collection, (ref) => ref.where('active', '==', true))
        .snapshotChanges();

  }

  getDoc(collection: string, condition: string) {
    return this.afs
      .collection(collection, (ref) => ref.where('category', '==', condition))
      .snapshotChanges();
  }

  createDoc(coll: string, item: any) {
    this.afs.collection(coll).add(item);
  }

  updateDoc(coll: string, id: string, item, image: any = null) {
    this.afs
      .collection(coll)
      .doc(id)
      .update(item)
      .then((suc) => {
        if (image) {
          this.deleteFile(image);
        }
      });
  }

  deleteDoc(coll: string, id: string, item = '') {
    if (coll === 'banners') {
      this.afs
        .collection(coll)
        .doc(id)
        .delete()
        .then((suc) => {
          this.deleteFile(item);
        });
    } else {
      this.afs.collection(coll).doc(id).delete();
    }
  }

  searchProducts(term: string, filter: string) {
    if (filter === 'All') {
      // eslint-disable-next-line max-len
      return this.afs
        .collection('products', (ref) =>
          ref
            .where('searchField', 'array-contains', term)
            .where('stock', '>', 0)
        )
        .snapshotChanges();
    }
    return this.afs
      .collection('products', (ref) =>
        ref
          .where('searchField', 'array-contains', term)
          .where('stock', '>', 0)
          .where('category', '==', filter)
      )
      .snapshotChanges();
  }

  async deleteFile(file: string) {
    //console.log(file)
    try {
      const storage = this.afStore;
      const storageRef = await storage.refFromURL(file);
      storageRef.delete().subscribe(() => {
        //console.log('Item deleted');
      });
    } catch {}
  }

  async loadCart() {
    const result = this.cookie.get(CART_STORAGE_KEY);
    if (result) {
      this.cartKey = result;

      this.afs
        .collection('carts')
        .doc(this.cartKey)
        .valueChanges()
        .subscribe((result: any) => {
          // Filter out our timestamp
          delete result.lastUpdate;

          this.cart.next(result || {});
        });
    } else {
      // Start a new cart
      const fbDocument = await this.afs.collection('carts').add({
        lastUpdate: firebase.serverTimestamp(),
      });
      this.cartKey = fbDocument.id;
      // Store the document ID locally
      await this.cookie.set(CART_STORAGE_KEY, this.cartKey);

      // Subscribe to changes
      this.afs
        .collection('carts')
        .doc(this.cartKey)
        .valueChanges()
        .subscribe((result: any) => {
          delete result.lastUpdate;
          //console.log('cart changed: ', result);
          this.cart.next(result || {});
        });
    }
  }

  addToCart(id, price) {
    // Update the FB cart

    this.afs
      .collection('carts')
      .doc(this.cartKey)
      .update({
        [id]: this.INCREMENT,
        price,
        lastUpdate: firebase.serverTimestamp(),
      }).then(suc => {

      });

    // Update the stock value of the product
    this.productsCollection.doc(id).update({
      stock: this.DECREMENT,
    });

    this.metrics.cartsTrack(id,true, false, false);

    this.loadCart();
  }

  removeFromCart(id, price) {
    // Update the FB cart
    this.afs
      .collection('carts')
      .doc(this.cartKey)
      .update({
        [id]: this.DECREMENT,
        price,
        lastUpdate: firebase.serverTimestamp(),
      });

    // Update the stock value of the product
    this.productsCollection.doc(id).update({
      stock: this.INCREMENT,
    });

    this.metrics.cartsTrack(id,false, true, false);
    this.loadCart();
  }

  deleteItem(id) {
    this.afs
      .collection('carts')
      .doc(this.cartKey)
      .update({
        [id]: 0,
        price: 0,
        lastUpdate: firebase.serverTimestamp(),
      });

      this.metrics.cartsTrack(id,false, false, true);
  }

  async checkoutCart(order) {
    // Create an order

    const loading = await this.loadingCtrl.create();
    await loading.present();
    await this.afs
      .collection('orders')
      .add(order)
      .then((suc) => {
        loading.dismiss();
        this.checkedOut();
      })
      .catch((err) => {
        loading.dismiss();
        alert(err);
      });

    // Clear old cart
    this.afs.collection('carts').doc(this.cartKey).set({
      lastUpdate: firebase.serverTimestamp(),
    });

    this.metrics.checkOuts(order.orderId);
  }

  getMyOrders(id: string) {
    return this.afs
      .collection('orders', (ref) => ref.where('ownerId', '==', id).orderBy('timestamp', 'desc'))
      .snapshotChanges();
  }

  getOrders(id: string) {
    return this.afs
      .collection('users')
      .doc(id)
      .collection('orders', ref => ref.orderBy('timestamp', 'desc'))
      .snapshotChanges();
  }

  delOrder(id, ide){
  this.afs.collection('users').doc(id).collection('orders').doc(ide).delete()
  }


  async createRecord(coll: string, data: any, report: string = '') {
    data.searchField = this.generateSearchField(data.businessName);
    const dbRef = await this.afs
      .collection(coll)
      .add(data)
      .then((suc) => {
        suc.update({ userDocId: suc.id });
        this.cookie.set('userDocId', suc.id);
        try {
          const user = JSON.parse(this.cookie.get('userinfo'));
          user['userDocId'] = suc.id;
          this.cookie.set('userinfo', JSON.stringify(user));
        } catch {}
      });
  }

  generateSearchField(term: string) {
    return term.trim().toLowerCase().split(' ');
  }

  getUser(coll: string, uid: string) {
    return this.afs.collection(coll, (ref) => ref.where('id', '==', uid)).get();
  }

  getUsers(coll: string = 'users') {
    return this.afs
      .collection(coll, (ref) =>
        ref.where('accountType', '==', 'vender').limit(7)
      )
      .snapshotChanges();
  }

  getUserAll(coll: string = 'users') {
    return this.afs
      .collection(coll, (ref) => ref.where('accountType', '==', 'vender'))
      .snapshotChanges();
  }

  getUserInfo(coll: string, uid: string) {
    return this.afs
      .collection(coll, (ref) => ref.where('id', '==', uid))
      .snapshotChanges();
  }

  getUsersInfo(coll: string = 'users', uid: string) {
    return this.afs
      .collection(coll, (ref) => ref.where('userDocId', '==', uid))
      .snapshotChanges();
  }

  getShopByCategory(collection: string = 'users', condition: string, lmt = 25, location = null) {


    if(condition === 'All' && location){
      return this.afs
      .collection(collection, (ref) =>
        ref.where('accountType', '==', 'vender').where('locality', '==', location).limit(lmt)
      )
      .snapshotChanges();
    }

    else if(condition !== 'All' && location === null) {
      return this.afs
        .collection(collection, (ref) =>
          ref.where('accountType', '==', 'vender').where('category', '==', condition).limit(lmt)
        )
        .snapshotChanges();
    }
    else if(condition !== 'All' && location !== null) {
      return this.afs
        .collection(collection, (ref) =>
          ref.where('accountType', '==', 'vender').where('category', '==', condition).where('locality', '==', location).limit(lmt)
        )
        .snapshotChanges();
    }
    else if (condition === 'All') {
      return this.afs
        .collection(collection, (ref) => ref.where('accountType', '==', 'vender').limit(lmt))
        .snapshotChanges();
    }
  }

  searchShops(term: string, filter: string) {
    if (filter === 'All') {
      // eslint-disable-next-line max-len
      return this.afs
        .collection('products', (ref) =>
          ref.where('searchField', 'array-contains', term).where('accountType', '==', 'vender')
        )
        .snapshotChanges();
    }
    return this.afs
      .collection('products', (ref) =>
        ref
          .where('searchField', 'array-contains', term)

          .where('category', '==', filter)
      )
      .snapshotChanges();
  }

  followShop(coll = 'users', docid, userId) {
    this.afs
      .collection(coll)
      .doc(docid)
      .update({ followers: this.INCREMENT })
      .then((suc) => {
        this.afs
          .collection(coll)
          .doc(userId)
          .update({ following: firebase.arrayUnion(docid) });
      });
  }

  unFollowShop(coll = 'users', docid, userId) {
    this.afs
      .collection(coll)
      .doc(docid)
      .update({ followers: this.DECREMENT })
      .then((suc) => {
        this.afs
          .collection(coll)
          .doc(userId)
          .update({ following: firebase.arrayRemove(docid) });
      });
  }

  updateUserLocation(locations) {
    this.afs.collection('users').doc(this.cookie.get('userDocId')).update({
      locations,
    });
  }

  async updateUser(info) {
    info.searchField = this.generateSearchField(info.businessName);
    const loading = await this.loadingCtrl.create();
    loading.present();

    const id = this.cookie.get('userDocId');
    try {
      const user = JSON.parse(this.cookie.get('userinfo'));
      user['userDocId'] = id;
      this.cookie.set('userinfo', JSON.stringify(user));
    } catch {}
    this.afs
      .collection('users')
      .doc(id)
      .update(info)
      .then((res) => {
        loading.dismiss();
      })
      .catch((err) => {
        loading.dismiss();
      });
  }




  async dispatchOrders(id: string, order: any) {
    await this.afs.collection('users').doc(id).collection('orders').add(order);
  }



  updateOrderStatus(userId, orderId, itemId, status) {
    this.afs
      .collection('users')
      .doc(userId)
      .collection('orders')
      .doc(orderId)
      .update({
        is_delivered: status.is_delivered,
        is_cancelled: status.is_cancelled,
        is_pending: status.is_pending,
      });

    this.afs
      .collection('orders', (ref) => ref.where('orderId', '==', itemId))
      .get()
      .subscribe((ref) => {
        const doc = ref.docs[0];
        doc.ref.update({
          is_delivered: status.is_delivered,
          is_cancelled: status.is_cancelled,
          is_pending: status.is_pending,
          updatedDate: new Date().toISOString(),
        });
      });
  }

  async checkedOut() {
    const alert = await this.alertCtrl.create({
      header: 'Order placed successfully',
      message: 'Thanks for your order',
      buttons: [
        {
          text: 'My orders',
          id: 'confirm-button',
          handler: () => {
            this.router.navigate(['tabs/invoice']);
          },
        },
        {
          text: 'Continue Shopping',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            this.router.navigate(['tabs/tab1']);
          },
        },
      ],
    });

    await alert.present();
  }

  refreshFuctions() {}



  addToDeleteRepo(prod){
    const db = this.afs.collection('products');
    db.doc(prod.id).delete().then( suc => {
      this.afs.collection('deletedproducts').add(prod);
    });
  }
}
