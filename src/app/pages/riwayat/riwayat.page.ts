import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  standalone: false,
  selector: 'app-riwayat',
  templateUrl: './riwayat.page.html',
  styleUrls: ['./riwayat.page.scss']
})
export class RiwayatPage {
  orders: any[] = [];

  constructor(private api: ApiService) {}

  ionViewWillEnter() {
    this.loadRiwayat();
  }

  async loadRiwayat() {
    try {
      const obs = await this.api.getUserOrders(); // Mengambil observable
      obs.subscribe(res => {
        this.orders = res;
      }, err => {
        console.error('Gagal mengambil riwayat:', err);
      });
    } catch (error) {
      console.error('Kesalahan saat mengambil riwayat:', error);
    }
  }
}
