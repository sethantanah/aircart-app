import { CookieService } from 'ngx-cookie-service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-product-list',
  templateUrl: './prouduct-list.component.html',
  styleUrls: ['./prouduct-list.component.scss'],
})
export class ProuductListComponent implements OnInit, OnDestroy {
  products: any = [];
  productsList: any =[];
  productsSub: any = '';

  refreshSub: any;

  constructor(
    private productService: ProductService,
    private cookie: CookieService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
   this.getProducts();

     this.refreshSub = this.productService.refreshData.subscribe(ref => {
            if(ref){
              this.getProducts();
            }
      });
  }
  ngOnDestroy(): void {
    this.productsSub.unsubscribe();
    this.refreshSub.unsubscribe();
  }

  getProducts(){
    this.productsSub = this.productService
    .getMyProducts(this.cookie.get('uid'))
    .subscribe((res) => {
      this.productsList = res.map((document: any) => ({
        // eslint-disable-next-line @typescript-eslint/ban-types
        ...(document.payload.doc.data() as {}),
        id: document.payload.doc.id,
      }));
      this.products = this.productsList;
    });
  }

  getImage(images = []) {
    return images[0];
  }

  deleteProduct(id: string) {
    this.productService.deleteProduct(id);
  }

  postProduct(product) {
    this.router.navigate(['upload-product', 'edit', JSON.stringify(product)]);
  }

  createProduct() {
    this.router.navigate(['upload-product', 'create', JSON.stringify({})]);
  }

  search(searchTerm){
    const filteredItems = [];
    if(searchTerm.length > 2){
      this.productsList.forEach(prod => {
        prod.searchField.forEach(term => {
         if(term.trim().toLowerCase() === searchTerm.trim().toLowerCase()){
           filteredItems.push(prod);
         }
        });
       });
       this.products = filteredItems;
    }else{
      this.products = this.productsList;
    }
  }


  async deleteAlert(prod){
   const alert = await this.alertCtrl.create({
    header: 'Confirm delete',
    message: 'Really want to delete this product?',
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
      },
      {
        text: 'Delete',
        handler: ()=> {
          this.productService.addToDeleteRepo(prod);
        }
      }
    ]
   });

   await alert.present();
  }
}
