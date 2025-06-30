import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  standalone: false,
  selector: 'app-orderan',
  templateUrl: './orderan.page.html',
  styleUrls: ['./orderan.page.scss'],
})
export class OrderanPage {
  segment: string = 'orderan'; // default segment
  orders: any[] = [];
  trackingOrders: any[] = [];

  constructor(private api: ApiService) {}

  ionViewWillEnter() {
    this.loadOrders();
    this.loadTracking();
  }

  segmentChanged() {
    // Bisa buat aksi jika diperlukan saat segment berubah
  }

  async loadOrders() {
    const obs = await this.api.getUserOrders();
    obs.subscribe(res => {
      this.orders = res;
    });
  }

  async loadTracking() {
    // Untuk contoh, kita pakai data order yg sama,
    // tapi bisa request endpoint khusus tracking dari API jika ada
    const obs = await this.api.getUserOrders();
    obs.subscribe(res => {
      // Misal di backend ada field delivery_status, tracking_number
      this.trackingOrders = res;
    });
  }
}
