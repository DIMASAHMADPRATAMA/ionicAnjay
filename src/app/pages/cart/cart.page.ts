import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage {
  cart: any[] = [];
  total: number = 0;

  constructor(
    private api: ApiService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.loadCart();
  }

  async loadCart() {
    const obs = await this.api.getCart();
    obs.subscribe(res => {
      this.cart = res;
      this.cart.forEach(item => item.selected = true);
      this.recalculateTotal();
    });
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  recalculateTotal() {
    this.total = this.cart
      .filter(item => item.selected)
      .reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  async remove(id: number) {
    const obs = await this.api.removeFromCart(id);
    obs.subscribe(async res => {
      await this.showToast('Item dihapus');
      this.loadCart();
    });
  }

  async showToast(message: string, color = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }

  goToCheckout() {
    const selectedItems = this.cart.filter(item => item.selected);
    this.router.navigate(['/checkout'], {
      state: { cartItems: selectedItems }
    });
  }
}
