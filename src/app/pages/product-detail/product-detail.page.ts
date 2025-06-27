import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  standalone:false,
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html'
})
export class ProductDetailPage {
  product: any;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router
  ) {}

  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    this.api.getProductById(id).then(obs => {
      obs.subscribe(res => {
        this.product = res;
      });
    });
  }

  addToCart() {
    this.api.addToCart({ product_id: this.product.id, quantity: 1 }).then(obs => {
      obs.subscribe(() => {
        this.router.navigate(['/cart']); // langsung ke checkout
      });
    });
  }

  goToCheckout() {
  this.router.navigate(['/checkout']);
}

}
