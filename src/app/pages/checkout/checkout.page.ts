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

  name: string = '';
  phone: string = '';
  postalCode: string = '';
  address: string = '';
  courier: string = '';

  product: any = null;
  quantity: number = 1;

  constructor(
    private api: ApiService,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state?.['product']) {
      this.product = nav.extras.state['product'];
      this.quantity = nav.extras.state['quantity'] || 1;

      this.cartItems = [{
        product: this.product,
        quantity: this.quantity
      }];

      this.total = this.product.price * this.quantity;
    } else if (nav?.extras?.state?.['cartItems']) {
      this.cartItems = nav.extras.state['cartItems'];
      this.total = this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    }
  }

  ionViewWillEnter() {
    if (!this.product && this.cartItems.length === 0) {
      this.loadCart();
    }
  }

  async loadCart() {
    const obs = await this.api.getCart();
    obs.subscribe(res => {
      const grouped: { [productId: number]: any } = {};

      for (const item of res) {
        const pid = item.product.id;
        if (!grouped[pid]) {
          grouped[pid] = {
            product: item.product,
            quantity: item.quantity
          };
        } else {
          grouped[pid].quantity += item.quantity;
        }
      }

      this.cartItems = Object.values(grouped);
      this.total = this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    });
  }

  async checkout() {
    // 🔒 Validasi input form
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

    // Payload umum
    const payload = {
      name: this.name,
      phone: this.phone,
      postal_code: this.postalCode,
      courier: this.courier,
      address: this.address,
    };

    if (this.product) {
      // ✅ Checkout langsung (dari produk)
      const directPayload = {
        ...payload,
        product_id: this.product.id,
        quantity: this.quantity
      };
      const obs = await this.api.directCheckout(directPayload);
      obs.subscribe(
        async res => await this.afterSuccess(res.order),
        async err => await this.showToast('Checkout gagal (langsung)', 'danger')
      );
    } else {
      // ✅ Checkout dari keranjang
      const items = this.cartItems.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      }));

      const obs = await this.api.checkout({
        ...payload,
        items
      });

      obs.subscribe(
        async res => await this.afterSuccess(res.order),
        async err => {
          console.error('❌ Checkout keranjang error:', err.error);
          const msg =
            err.error?.errors?.items?.[0] ||
            err.error?.message ||
            'Checkout gagal (keranjang)';
          await this.showToast(msg, 'danger');
        }
      );
    }
  }

  async afterSuccess(order: any) {
    await this.showToast('Checkout berhasil', 'success');
    localStorage.setItem('lastOrderId', order.id);

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
