import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { CookieService } from 'ngx-cookie-service';
import { ProductService } from 'src/app/services/product.service';
import { StorageService } from 'src/app/services/storage.service';
import { Share } from '@capacitor/share';

interface Shop{
  id: string;
  ownerId: string;
  shopName: string;
  products: object[];
  followers: number;
  category: string;
  tagline: string;
  about: string;
  image: string;
}

@Component({
  selector: 'app-shops-details',
  templateUrl: './shops-details.page.html',
  styleUrls: ['./shops-details.page.scss'],
})
export class ShopsDetailsPage implements OnInit {
  products: any = [];
  productsSub: any = '';
  userInfo: any;
  usersSub: any;
  liked = false;
  shop: any;


  transparentToolBar = false;
  removeTitle = false;

  constructor(private productService: ProductService, private cookie: CookieService,
     private router: Router, private activatedRoute: ActivatedRoute, private db: StorageService,
     private toastCtrl: ToastController) { }

  ngOnInit() {

    this.activatedRoute.paramMap.subscribe( res => {
      if(res){
        //console.log(res.get('shop-id'));
        this.usersSub = this.productService.getUsersInfo('users', res.get('shop-id')).subscribe( docs => {
          this.userInfo = docs.map( doc => (
            {
                 ...(doc.payload.doc.data() as {}),
                 docId: doc.payload.doc.id
            }
          ));
          this.userInfo = this.userInfo[0];
          //console.log(this.userInfo);
          this.checkFollowing();
         // console.log(this.userInfo, res.get('shop-id'));
          this.productsSub = this.productService.getMyProducts(this.userInfo.id).subscribe(doc => {
            this.products = doc.map(
              (document: any) =>
                ({
                  // eslint-disable-next-line @typescript-eslint/ban-types
                  ...(document.payload.doc.data() as {}),
                  id: document.payload.doc.id,
                })
            );
          this.products = this.products.filter(product => 
            product.stock>0 && product.softdelete === false
          );
          });
        });
      }
    });



  }

  checkFollowing(){

    try{
      const users = JSON.parse(this.cookie.get('userinfo'));
      this.shop = users;
      users.following.forEach(user => {
          // console.log(user,this.userInfo.docId);
        if(user === this.userInfo.docId){
        // console.log(user);
          this.liked = true;
        }
      });
    }catch{
    this.liked = false;
    }

  }

  followerShop(docid: string){
    const loggedIn = this.cookie.check('uid');
    if(loggedIn){
    const user = JSON.parse(this.cookie.get('userinfo'));
try{
  if(this.liked === false){
    this.liked = true;
    this.productService.followShop('users', docid, user.userDocId);
    this.updateUserDetails(docid, false);
  }else{

    if(this.userInfo.following.length > 0){
      this.liked = false;

      this.productService.unFollowShop('users', docid, user.userDocId);

    this.updateUserDetails(docid,true);
    }

  }
}catch{

}
    }else{
this.presentToast();
    }
  }

  updateUserDetails(shopId, remove){
    try{
      const user = JSON.parse(this.cookie.get('userinfo'));
       if(remove){
        const shops = [];
        user.following.forEach(shop => {
          if(shop !== shopId){
            shops.push(shop);
          }
        });
        user.following = shops;

       }else{
        if(user.following){
          user.following.push(shopId);
        }else{
          user['following'] = [shopId];
        }


       }
       this.cookie.set('userinfo', JSON.stringify(user), 365);
      this.checkFollowing();
    }catch{

    }
  }

  async share(shopName, shopUrl) {
    const shareData = {
      title: shopName,
      text: 'Hello, i am inviting you to visit '+shopName+' on AirCart. I have  some amazing products for you.',
      url: 'https://aircart.shop/shops-details/'+shopUrl,
    };
     await Share.share({
        title: shopName,
        text: 'Hello, i am inviting you to visit '+shopName+' on AirCart. I have  some amazing products for you.',
        url: 'https://aircart.shop/shops-details/'+shopUrl,
        dialogTitle: 'Share with buddies',
      });
    // window.location.href='https://wa.me/'+
    //   '?text=Hello,%20visit%20'+this.shop.businessName+'%20on%20AirCart%20they%20have%20amazing%20products.%20'
    //   +'https://aircart.shop/shops-details/'+shopUrl;
    try{

    }catch{
      await navigator.share(shareData);
      await Share.share({
        title: shopName,
        text: 'Hello, i am inviting you to visit '+shopName+' on AirCart. I have  some amazing products for you.',
        url: 'https://aircart.shop/shops-details/'+shopUrl,
        dialogTitle: 'Share with buddies',
      });
    }
  }

  whatsaap(){
    // eslint-disable-next-line max-len
    window.location.href='https://wa.me/'+ this.shop.phone +'?text=Hello,%20this%20is%20'+this.shop.businessName+'%20I%20visited%20you%20shop%20on%20AirCart';
  }

  async presentToast(msg: string ='Login to follow this shop') {
    const toast = await this.toastCtrl.create({
      message: msg,
      mode: 'ios',
      duration: 2000,
      position: 'top',
      color: 'primary',
      icon: 'key'
    });

    await toast.present();
  }


  detailsPage(product: any){
    this.router.navigate(['/product-details', JSON.stringify(product)]);
  }





  onScroll(ev) {
    const offset = ev.detail.scrollTop;
    if (offset > 35) {
      this.transparentToolBar = true;
    } else {
      this.transparentToolBar = false;
    }

    if(offset > 300){
      this.removeTitle = true;
    }else{
      this.removeTitle = false;
    }
  }

}
