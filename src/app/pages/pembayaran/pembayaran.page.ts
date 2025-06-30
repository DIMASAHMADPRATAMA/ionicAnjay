import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

declare global {
  interface Window {
    snap: any;
  }
}

@Component({
  standalone: false,
  selector: 'app-pembayaran',
  templateUrl: './pembayaran.page.html',
  styleUrls: ['./pembayaran.page.scss'],
})
export class PembayaranPage implements OnInit {
  subtotal: number = 0;
  ongkir: number = 20000;
  total: number = 0;
  alamat: string = '';
  lastOrderId: string = '';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private api: ApiService
  ) {}

  ngOnInit() {
    const lastOrderId = localStorage.getItem('lastOrderId');
    const history = JSON.parse(localStorage.getItem('order_history') || '[]');
    const lastOrder = history[history.length - 1];

    if (lastOrder) {
      this.subtotal = lastOrder.total; // asumsi total di sini belum termasuk ongkir
      this.alamat = lastOrder.address;
      this.total = this.subtotal + this.ongkir;
      this.lastOrderId = lastOrderId ?? '';
    }
  }

  async bayarSekarang() {
    const alert = await this.alertController.create({
      header: 'Konfirmasi Pembayaran',
      message: `Bayar sebesar Rp ${this.total.toLocaleString()} melalui Midtrans?`,
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
        },
        {
          text: 'Bayar',
          handler: () => {
            this.prosesPembayaran();
          },
        },
      ],
    });

    await alert.present();
  }

  async prosesPembayaran() {
    try {
      const obs = await this.api.createMidtransTransaction({
        address: this.alamat,
        total: this.total,
        order_id: this.lastOrderId,
      });

      obs.subscribe(
        async (res: any) => {
          if (!res.token) {
            alert('❌ Gagal mendapatkan token Midtrans.');
            return;
          }

          if (typeof window.snap === 'undefined') {
            alert(
              `⚠️ Midtrans Snap belum dimuat.\nTambahkan di index.html:\n\n<script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key="Mid-client-KEYANDA"></script>`
            );
            return;
          }

          window.snap.pay(res.token, {
            onSuccess: () => {
              alert('✅ Pembayaran berhasil!');
              this.router.navigate(['/riwayat']);
            },
            onPending: () => {
              alert('⌛ Menunggu pembayaran.');
            },
            onError: () => {
              alert('❌ Pembayaran gagal.');
            },
            onClose: () => {
              alert('❗ Anda menutup popup pembayaran.');
            },
          });
        },
        (err) => {
          console.error('❌ Error Midtrans:', err);
          alert('❌ Gagal membuat transaksi. Pastikan kamu sudah login dan memiliki isi keranjang.');
        }
      );
    } catch (err) {
      console.error('❌ Error:', err);
      alert('❌ Terjadi kesalahan saat memproses pembayaran.');
    }
  }
}
