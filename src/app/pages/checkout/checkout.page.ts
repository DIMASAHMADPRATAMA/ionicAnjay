import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  standalone:false,
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage {
  cartItems: any[] = [];
  total: number = 0;
  address: string = '';

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
      this.cartItems = res;
      this.total = this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    });
  }

  async checkout() {
    if (!this.address || this.address.trim().length < 5) {
      return this.showToast('Alamat wajib diisi dengan benar', 'danger');
    }

    const obs = await this.api.checkout({ address: this.address });
    obs.subscribe(async res => {
      await this.showToast('Checkout berhasil', 'success');
      this.router.navigate(['/pembayaran']); // lanjut ke pembayaran
    }, async err => {
      await this.showToast('Checkout gagal', 'danger');
    });
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color
    });
    toast.present();
  }
}
