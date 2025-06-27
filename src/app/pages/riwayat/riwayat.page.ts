import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  standalone:false,
  selector: 'app-riwayat',
  templateUrl: './riwayat.page.html'
  
})
export class RiwayatPage {
  orders: any[] = [];

  constructor(private api: ApiService) {}

  ionViewWillEnter() {
    this.api.getUserOrders().then(obs => {
      obs.subscribe(res => {
        this.orders = res;
      });
    });
  }
}
