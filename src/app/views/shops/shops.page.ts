import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { tmpdir } from 'os';
import { MetricsService } from 'src/app/services/metrics.service';
import { ProductService } from 'src/app/services/product.service';

import { Locations } from '../../data-models/locations';

@Component({
  selector: 'app-shops',
  templateUrl: './shops.page.html',
  styleUrls: ['./shops.page.scss'],
})
export class ShopsPage implements OnInit, OnDestroy {
shops = [];
shopsSub: any;

categories = [

];
transparentToolBar = false;
productsTemp=[];
products=[];
prodsub: any='';
filter = 'All';
searchTerm='';

timer: any;
noshops = false;

locations: any;
regions: any;
selectedRegion: string;
cities: string[] = [];
citiesTemp = [];

selectedCity = null;


  constructor(private router: Router, private db: ProductService, private metrics: MetricsService) {
    this.locations = new Locations();
    this.locations = this.locations.locations;
    this.regions = Object.keys(this.locations);

    this.regions.forEach( r => {
      this.cities.push(...this.locations[r]);
      this.citiesTemp = this.cities;
    });
  }

  ngOnInit() {
  this.filterProducts('All');
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
  ngOnDestroy(){
    this.shopsSub.unsubscribe();
  }

  filterProducts(category ='All', lmt = 100, locality=null){
    this.setTimer();
    this.shopsSub = this.db.getShopByCategory('users', category,lmt, this.selectedCity).subscribe(res => {
      this.shops  = res.map(data =>
        (
          {
            ...(data.payload.doc.data() as {}),
            id: data.payload.doc.id,
            docId: data.payload.doc.id
          } as any
        )
      );

      if(this.shops.length > 0){
        this.noshops = false;
  window.clearInterval(this.timer);
       }
    });

  }

  search(term){
    this.searchTerm=term;
if(term.length > 0){
  this.setTimer();
  this.prodsub = this.db.searchShops(term.toLowerCase(),this.filter).subscribe(res => {
    this.shops = res.map(data =>
      (
        {
          ...(data.payload.doc.data() as {}),
          id: data.payload.doc.id,
          selected: false
        } as any
      )
    );

       if(this.shops.length > 0 || term.length > 8){
        this.recordMetrics(term, this.shops.length);
       }

    // this.products = this.productsTemp;
     if(this.shops.length > 0){
      this.noshops = false;
window.clearInterval(this.timer);
     }
  });
}else{
      this.cancelSearch();
    }
  }

  cancelSearch(){
    if(this.searchTerm.length === 0){
      this.filterProducts();
    }
  }


  searchCities(term){
 if(term.length>0){
  this.citiesTemp = [];
  this.cities.forEach( city=> {
    if(city.substring(0, term.length).toLowerCase() === term.toLowerCase()){
          this.citiesTemp.push(city);
    }
  });
 }
  }

  filterByCity(city){
  
    this.selectedCity = city;
 this.filterProducts(this.filter, 500, city);
  }

  cancelCity(){
    this.selectedCity = null;
    this.filterProducts();
  }

  setTimer(){
    let time = 0;
    this.timer = window.setInterval(()=>{
       time +=1;
      // console.log(time);
       if(time === 10){
        this.noshops = true;
       }
    }, 1000);
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
    this.categories.forEach((category: any, i: number) => {
      if (index !== i) {
        this.categories[i].selected = false;
      }
    });
    // if(this.searchTerm.length>0){
    //   this.search(this.searchTerm);
    // }

    this.filterProducts(cat);
  }

  toshopDetails(shopId: string){
    this.router.navigate(['/shops-details',shopId]);
  }


  recordMetrics(term, found){
    this.metrics.recordSearches('shops', term, found);
  }
}
