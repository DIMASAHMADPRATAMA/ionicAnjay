import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage {
  cartItems: any[] = [];
  total: number = 0;

  // Tambahan field user input
  name: string = '';
  phone: string = '';
  postalCode: string = '';
  address: string = '';
  courier: string = '';

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
    // Validasi sederhana
    if (!this.name || this.name.length < 3) {
      return this.showToast('Nama wajib diisi', 'danger');
    }
    if (!this.phone || this.phone.length < 10) {
      return this.showToast('Nomor HP tidak valid', 'danger');
    }
    if (!this.address || this.address.trim().length < 5) {
      return this.showToast('Alamat wajib diisi dengan benar', 'danger');
    }
    if (!this.postalCode) {
      return this.showToast('Kode Pos wajib diisi', 'danger');
    }
    if (!this.courier) {
      return this.showToast('Pilih kurir terlebih dahulu', 'danger');
    }

    // Kirim hanya address ke backend
    const obs = await this.api.checkout({ address: this.address });

    obs.subscribe(async res => {
      await this.showToast('Checkout berhasil', 'success');

      // Simpan order ID ke localStorage untuk pembayaran
      localStorage.setItem('lastOrderId', res.order.id);

      // Simpan info tambahan ke localStorage (tidak masuk ke backend)
      const localOrderInfo = {
        name: this.name,
        phone: this.phone,
        postalCode: this.postalCode,
        courier: this.courier,
        address: this.address,
        cartItems: this.cartItems,
        total: this.total,
        createdAt: new Date()
      };
      const history = JSON.parse(localStorage.getItem('order_history') || '[]');
      history.push(localOrderInfo);
      localStorage.setItem('order_history', JSON.stringify(history));

      this.router.navigate(['/pembayaran']);
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
