
import { ProductService } from 'src/app/services/product.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { MetricsService } from 'src/app/services/metrics.service';


@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

 categories = [

];
transparentToolBar = false;
productsTemp=[];
products=[];
prodsub: any='';
filter = 'All';
searchTerm='';

  constructor(private db: ProductService,private router: Router, private navCtrl: NavController,
    private metrics: MetricsService) { }

  ngOnInit() {

      this.db.getDocs('categories').subscribe(res => {
        this.categories = res.map(data =>
          (
            {
              ...(data.payload.doc.data() as {}),
              id: data.payload.doc.id,
              selected: false
            } as any
          )
        );
        this.categories.unshift({ category: 'All', selected: true, id: 'thurhrgfyurgyu' });
      });
  }


   onScroll(ev) {
    const offset = ev.detail.scrollTop;
    if (offset > 20){
      this.transparentToolBar=true;
    }else{
      this.transparentToolBar = false;
    }
}

  removeStyles(index: number = 0, cat: string) {
    this.filter=cat;
    this.categories.forEach((cats: any, i: number) => {
      if (index !== i) {
        this.categories[i].selected = false;
      }
    });
    if(this.searchTerm.length>0){
      this.search(this.searchTerm);

    }
  }

  search(term){
    this.searchTerm=term;
   this.prodsub = this.db.searchProducts(term.toLowerCase(),this.filter).subscribe(res => {
      this.productsTemp = res.map(data =>
        (
          {
            ...(data.payload.doc.data() as {}),
            id: data.payload.doc.id,
            selected: false
          } as any
        )
      );

       this.products = this.productsTemp.filter( p => !p.softdelete
       );
       if(this.products.length > 0 || term.length > 6){
        this.recordMetrics(term, this.products.length);
       }

    });
  }


  detailsPage(product: any) {

    this.router.navigate(['product-details', JSON.stringify(product)]);
  }

  back(){
    this.navCtrl.back();
  }

  recordMetrics(term, found){
    this.metrics.recordSearches('products', term, found);
  }
}
