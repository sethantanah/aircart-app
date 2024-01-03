import { ProductService } from 'src/app/services/product.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-bundle-offers',
  templateUrl: './bundle-offers.page.html',
  styleUrls: ['./bundle-offers.page.scss'],
})
export class BundleOffersPage implements OnInit {

  bundles: any = [1,2,3,4,5];
  count = 0;
  timer: any = 0;
  collectionSize = 0;


  categories = [];
  activeCategory = 'All';

   products = [];

  allProducts = [


  ];
  topProducts = [];

  category = '';
  nextBatch = 0;

  transparentToolBar = false;
  constructor(private router: Router, private activeRouter: ActivatedRoute, private db: ProductService) { }


  ngOnInit() {
    this.activeRouter.paramMap.subscribe(res =>{
      this.category = res.get('category');
      this.db.getDoc('subcategories', this.category).subscribe(res => {
        this.categories = res.map(data =>
          (
            {
              ...(data.payload.doc.data() as {}),
              id: data.payload.doc.id,
              selected:false
            }
          )
        );
        this.categories.unshift({ category: 'All', title:'All', selected: true, id: 'thurhrgfyurgyu' });
      });


      this.db.getProductByCategory('products', this.category, 20).subscribe(ress => {
        this.products = ress.map(data =>
          (
            {
              ...(data.payload.doc.data() as {}),
              id: data.payload.doc.id,
              selected: false
            }
          )
        );
        this.nextBatch = this.products[this.products.length-1].order;
        // this.allProducts = this.products.slice(6);
        // this.topProducts = this.products.slice(0, 6);
      });
    });

    this.db.getCollectionLength('products').get().subscribe(snap => {
      this.collectionSize = snap.size;
    });
   }

   getProducts(category: string) {
    this.activeCategory = category;
    if(category === 'All'){
      this.db.getProductByCategory('products',category, 30).subscribe(res => {
        this.products = res.map(data =>
          (
            {
              ...(data.payload.doc.data() as {}),
              id: data.payload.doc.id,
              selected: false
            }
          )
        );
        // this.allProducts = this.products.slice(6);
        // this.topProducts = this.products.slice(0, 6);
        this.products = this.products.filter(prod => prod.stock > 0 && prod.category === this.category);
        this.nextBatch = this.products[this.products.length-1].order;
      });
    }else{
     this.db
      .getProductBysubCategory('products', category)
      .subscribe((data) => {
        this.products = data.map(
          (document: any) =>
            ({
              // eslint-disable-next-line @typescript-eslint/ban-types
              ...(document.payload.doc.data() as {}),
              id: document.payload.doc.id,
            } as any)
        ).filter(prod => prod.stock > 0 && prod.subCategory === category);
        // this.allProducts = this.products.slice(6);
        // this.products = this.products.slice(0, 6);
        this.nextBatch = this.products[this.products.length-1].order;
      });
  }
}



   filterProducts(filter: string){
     const products = [];
     if(filter === 'All'){
       this.allProducts = this.products.slice(6);
       this.topProducts = this.products.slice(0, 6);

     }else{
       this.products.forEach(prod => {
          if(prod.subCategory === filter){
            products.push(prod);
          }
       });

     }
   }






  onScroll(ev) {
    const offset = ev.detail.scrollTop;
    if (offset > 20) {
      this.transparentToolBar = true;
    } else {
      this.transparentToolBar = false;
    }
  }

  removeStyles(index: number = 0, filterby: string) {
    this.getProducts(filterby);
    this.categories.forEach((cat: any, i: number) => {
      if (index !== i) {
        this.categories[i].selected = false;
      }
    });
  }


  offersPage() {
    this.router.navigate(['bundle-offers']);
  }

  toSerachPage(){
    this.router.navigate(['tabs/search']);
  }

  productDetails(product) {
    this.router.navigate(['/product-details', JSON.stringify(product)]);
  }



  // cartCount(check: boolean, item: any){
  //   let counter = 0;
  //     if(check){
  //       this.count --;
  //     }else{
  //       this.count++;
  //     }
  //     const cart = document.getElementById('cart-items');
  //      cart.classList.add('show-cart');
  //      cart.style.zIndex = '999999';
  //       cart.classList.remove('hide-cart');
  //      if(cart){+---------------******
  //        this.timer = window.setInterval(()=>{
  //          counter++;
  //          if(counter === 2){
  //              cart.classList.remove('show-cart');
  //               cart.classList.add('hide-cart');
  //                 cart.style.zIndex = '1';
  //             window.clearInterval(this.timer);
  //          }
  //        },1000);
  //      }
  // }




  loadData(event){
    if(this.products.length < this.collectionSize){
      if(this.activeCategory==='All'){
        this.db.getProductByCategoryLimit('products', this.nextBatch, 10).subscribe((data) => {
          const prods = data.map(
            (document: any) =>
              ({
                // eslint-disable-next-line @typescript-eslint/ban-types
                ...(document.payload.doc.data() as {}),
                id: document.payload.doc.id,
              } as any)
          );
          this.products = [...this.products, ...prods];
          event.target.complete();
        });
      }else{
        this.db. getProductBysubCategoryLimit('products', this.nextBatch, 10, this.activeCategory).subscribe((data) => {
          const prods = data.map(
            (document: any) =>
              ({
                // eslint-disable-next-line @typescript-eslint/ban-types
                ...(document.payload.doc.data() as {}),
                id: document.payload.doc.id,
              } as any)
          );
          this.products = [...this.products, ...prods];

          this.nextBatch = this.products[this.products.length-1].order;
          this.products = this.getUniqueListBy(this.products, 'order');

          event.target.complete();
        });
      }
    }else{
      event.target.disabled = true;
    }

  }

  getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()];
}


}


















