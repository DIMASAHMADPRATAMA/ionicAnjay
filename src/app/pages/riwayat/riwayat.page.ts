import { Component, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';

@Component({
  standalone: false,
  selector: 'app-riwayat',
  templateUrl: './riwayat.page.html',
  styleUrls: ['./riwayat.page.scss']
})
export class RiwayatPage implements OnDestroy {
  orders: any[] = [];
  loading = false;
  errorMessage = '';
  private subscription?: Subscription;

  constructor(private api: ApiService) {}

  ionViewWillEnter() {
    this.loadRiwayat();
  }

  ionViewWillLeave() {
    // Hentikan subscribe agar tidak memory leak
    this.subscription?.unsubscribe();
  }

  async loadRiwayat() {
    this.loading = true;
    this.errorMessage = '';
    try {
      const obs = await this.api.getUserOrders();
      this.subscription = obs.subscribe({
        next: (res) => {
          this.orders = res;
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Gagal mengambil riwayat transaksi.';
          console.error('Gagal mengambil riwayat:', err);
          this.loading = false;
        }
      });
    } catch (error) {
      this.errorMessage = 'Kesalahan saat mengambil riwayat transaksi.';
      console.error('Kesalahan saat mengambil riwayat:', error);
      this.loading = false;
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
