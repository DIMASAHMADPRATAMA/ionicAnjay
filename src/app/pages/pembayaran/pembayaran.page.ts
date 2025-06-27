import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

// Definisikan window.snap untuk TypeScript agar tidak error
declare global {
  interface Window {
    snap: any;
  }
}

@Component({
  standalone:false,
  selector: 'app-pembayaran',
  templateUrl: './pembayaran.page.html',
  styleUrls: ['./pembayaran.page.scss'],
})
export class PembayaranPage implements OnInit {
  subtotal: number = 150000;
  ongkir: number = 20000;
  total: number = 0;
  metodePembayaran: string = 'midtrans';

  constructor(
    private router: Router,
    private alertController: AlertController,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.total = this.subtotal + this.ongkir;
  }

  async bayarSekarang() {
    const alert = await this.alertController.create({
      header: 'Konfirmasi Pembayaran',
      message: `Bayar sebesar Rp ${this.total.toLocaleString()} dengan metode <strong>${this.metodePembayaran.toUpperCase()}</strong>?`,
      buttons: [
        {
          text: 'Batal',
          role: 'cancel'
        },
        {
          text: 'Bayar',
          handler: () => {
            this.prosesPembayaran();
          }
        }
      ]
    });

    await alert.present();
  }

  async prosesPembayaran() {
    try {
      const obs = await this.api.createMidtransTransaction({
        total: this.total,
        metode: this.metodePembayaran
      });

      obs.subscribe(async (res: any) => {
        if (!res.token) {
          alert("❌ Gagal mendapatkan token Midtrans.");
          return;
        }

        if (typeof window.snap === 'undefined') {
          alert('⚠️ Midtrans Snap belum dimuat. Pastikan script Snap ada di index.html:\n\n<script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key="YOUR-CLIENT-KEY"></script>');
          return;
        }

        window.snap.pay(res.token, {
          onSuccess: async (result: any) => {
            console.log("✅ Pembayaran berhasil:", result);
            alert("✅ Pembayaran berhasil!");
            this.router.navigate(['/riwayat-transaksi']);
          },
          onPending: (result: any) => {
            console.log("⌛ Menunggu pembayaran:", result);
            alert("⌛ Menunggu pembayaran.");
          },
          onError: (result: any) => {
            console.error("❌ Pembayaran gagal:", result);
            alert("❌ Pembayaran gagal.");
          },
          onClose: () => {
            alert("❗ Anda menutup popup sebelum menyelesaikan pembayaran.");
          }
        });
      });
    } catch (err) {
      console.error("❌ Error saat proses pembayaran:", err);
      alert('❌ Gagal memproses pembayaran');
    }
  }
}
