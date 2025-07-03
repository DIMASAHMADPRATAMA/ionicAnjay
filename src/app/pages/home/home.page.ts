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
  newMessageCount: number = 0;

  private pollingInterval: any;

  constructor(private api: ApiService, private router: Router) {}

  ionViewWillEnter() {
    this.loadProducts();
    this.loadCategories();
    this.checkUnreadMessages();

    if (!this.pollingInterval) {
      this.pollingInterval = setInterval(() => this.checkUnreadMessages(), 5000);
    }
  }

  ionViewWillLeave() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  async loadProducts() {
    const obs = await this.api.getProducts();
    obs.subscribe(res => {
      this.products = res;
      this.filteredProducts = [...res];
      this.sortByStock();
    });
  }

  async loadCategories() {
    const obs = await this.api.getCategories();
    obs.subscribe(res => {
      this.categories = res;
    });
  }

  filterByCategory(category: string) {
    if (category.toLowerCase() === 'all') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(
        p => p.category?.name?.toLowerCase() === category.toLowerCase()
      );
    }
    this.sortByStock();
  }

  onSearchChange() {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(term)
    );
    this.sortByStock();
  }

  sortByStock() {
    this.filteredProducts.sort((a, b) => {
      if (a.stock === 0 && b.stock > 0) return 1;
      if (a.stock > 0 && b.stock === 0) return -1;
      return 0;
    });
  }

  goToDetail(product: any) {
    this.router.navigate(['/product-detail', product.id]);
  }

  addToCart(product: any, event: Event) {
    event.stopPropagation(); // ⬅ Kunci agar tidak double tambah

    this.api.addToCart({ product_id: product.id, quantity: 1 }).then(obs => {
      obs.subscribe(
        () => alert('Produk ditambahkan ke keranjang!'),
        err => {
          console.error(err);
          alert('Gagal menambahkan ke keranjang.');
        }
      );
    });
  }

  checkUnreadMessages() {
    this.api.getProfile().then(obs => {
      obs.subscribe(profile => {
        const userId = profile.id;
        this.api.getUnreadMessages(userId).then(unreadObs => {
          unreadObs.subscribe((res: any) => {
            console.log('🔔 Pesan belum dibaca:', res.unread);
            this.newMessageCount = res.unread || 0;
          });
        });
      });
    });
  }
}