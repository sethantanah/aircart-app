import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IonContent, IonInfiniteScroll, IonVirtualScroll } from '@ionic/angular';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit, OnDestroy {
  //  @ViewChild(IonContent) ionContent: IonContent;
 // @ViewChild(IonVirtualScroll) virtualScroll: IonVirtualScroll;

  categories = [];

  banners = [];

  products = [];
  allProducts = [];
  collectionSize = 0;

  title = 'Top Deals';
  discounts = true;
  prodSub: any;
  routerSub: any;

  category = 'All';
  transparentToolBar = false;

  lastVisible: any;
  nextBatch = 0;
  constructor(
    private router: Router,
    private db: ProductService,
    private activatedRoute: ActivatedRoute,

  ) {}

  ngOnInit() {
    this.getProducts('All');
    this.activatedRoute.paramMap.subscribe(route => {
      if(route.get('al')){
     this.title = route.get('al');
     this.discounts= false;
      }
    });

    this.prodSub = this.db.getDocs('categories').subscribe((res) => {
      this.categories = res.map(
        (data) =>
          ({
            ...(data.payload.doc.data() as {}),
            id: data.payload.doc.id,
            selected: false,
          } as any)
      );
      this.categories.unshift({
        category: 'All',
        selected: true,
        id: 'thurhrgfyurgyu',
      });
    });


    this.db.getCollectionLength('products').get().subscribe(snap => {
      this.collectionSize = snap.size;
    });

  }
  ngOnDestroy(): void {
    this.prodSub.unsubscribe();
  }

  getProducts(category: string) {
     const query = this.db.getProductByCategory('products', category,25);
  ///  this.lastVisible =   [query.docs.length-1];
    this.prodSub = query
      .subscribe((data) => {
        this.products = data.map(
          (document: any) =>
            ({
              // eslint-disable-next-line @typescript-eslint/ban-types
              ...(document.payload.doc.data() as {}),
              id: document.payload.doc.id,
            } as any)
        ).filter(prod => prod.stock > 0);
        // this.allProducts = this.products.slice(6);
        // this.products = this.products.slice(0, 6);

      // this.filterProducts();
    //  this. updateOrder()
    this.nextBatch = this.products[this.products.length-1].order;
      });
  }
  filterProducts(){
  const prods = [];
  this.products.forEach(prod => {
    if(prod.stock > 0){
      prods.push(prod);
    }
  });

  this.products = prods;
  }

  updateOrder(){
    let index = 70;
      const timer =   window.setInterval(()=>{
          if(index <=81){
            this.db.updateProductsOrder(this.products[index-1].id, index);
          index +=1;
          console.log(index);
          }else{

            console.log('upload complete! ', index);
           // window.clearInterval(timer)
          }
        }, 500);
  }

  toSerachPage() {
    this.router.navigate(['tabs/search']);
  }

  onScroll(ev) {
    const offset = ev.detail.scrollTop;
    const ionContent = document.getElementById('content');

    if (offset > 20) {
      this.transparentToolBar = true;
    } else {
      this.transparentToolBar = false;
    }
  }

  removeStyles(index: number = 0, cat: string) {
    this.category = cat;
    this.getProducts(cat);
    this.categories.forEach((cat: any, i: number) => {
      if (index !== i) {
        this.categories[i].selected = false;
      }
    });
  }

  offersPage() {
    this.router.navigate(['bundle-offers']);
  }

  productDetails(product) {
    this.router.navigate(['/product-details', JSON.stringify(product)]);
  }


  loadData(event){




    if(this.products.length < this.collectionSize){
      this.db.getProductByCategoryLimit('products', this.nextBatch, 10, this.category).subscribe((data) => {
        const prods = data.map(
          (document: any) =>
            ({
              // eslint-disable-next-line @typescript-eslint/ban-types
              ...(document.payload.doc.data() as {}),
              id: document.payload.doc.id,
            } as any)
        ).filter(prod => prod.stock > 0);
        this.products = [ ...this.products, ...prods];


     this.nextBatch = this.products[this.products.length-1].order;

      this.products = this.getUniqueListBy(this.products, 'order');





      event.target.complete();
      });
    }else{
      event.target.disabled = true;
    }

  }


  getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()];
}




}
