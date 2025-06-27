import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any[] = [];
  searchTerm: string = '';

  constructor(private api: ApiService, private router: Router) {}

  ionViewWillEnter() {
    this.loadProducts();
    this.loadCategories();
  }

  async loadProducts() {
    const obs = await this.api.getProducts();
    obs.subscribe(res => {
      this.products = res;
      this.filteredProducts = res;
    });
  }

  async loadCategories() {
    const obs = await this.api.getCategories();
    obs.subscribe(res => {
      this.categories = res;
    });
  }

  filterByCategory(category: string) {
    this.filteredProducts = this.products.filter(
      p => p.category?.name?.toLowerCase() === category.toLowerCase()
    );
  }

  onSearchChange() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(term)
    );
  }

  goToDetail(product: any) {
    this.router.navigate(['/product-detail', product.id]);
  }

  addToCart(product: any, event: Event) {
    event.stopPropagation(); // mencegah buka detail saat klik tombol
    this.api.addToCart({ product_id: product.id, quantity: 1 }).then(obs => {
      obs.subscribe(
        res => alert('Produk ditambahkan ke keranjang!'),
        err => {
          console.error(err);
          alert('Gagal menambahkan ke keranjang.');
        }
      );
    });
  }
}
