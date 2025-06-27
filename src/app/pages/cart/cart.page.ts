import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss']
})
export class CartPage {
  cart: any[] = [];
  total: number = 0;

  constructor(private api: ApiService, private router: Router) {}

  ionViewWillEnter() {
    this.loadCart();
  }

  async loadCart() {
    const obs = await this.api.getCart();
    obs.subscribe(res => {
      this.cart = res.map((item: any) => ({
        ...item,
        selected: false // default tidak dipilih
      }));
      this.recalculateTotal();
    });
  }

  recalculateTotal() {
    this.total = this.cart
      .filter(item => item.selected)
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  async remove(id: number) {
    const obs = await this.api.removeFromCart(id);
    obs.subscribe(() => this.loadCart());
  }

  async checkout() {
    const selectedItems = this.cart.filter(item => item.selected);

    if (selectedItems.length === 0) {
      alert('Silakan pilih produk yang ingin di-checkout.');
      return;
    }

    const payload = {
      items: selectedItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      })),
      total: this.total
    };

    const obs = await this.api.checkout(payload);
    obs.subscribe(() => {
      alert('Checkout berhasil!');
      this.router.navigate(['/riwayat']);
    }, err => {
      console.error(err);
      alert('Checkout gagal');
    });
  }

  goToCheckout() {
  this.router.navigate(['/checkout']);
}
}
