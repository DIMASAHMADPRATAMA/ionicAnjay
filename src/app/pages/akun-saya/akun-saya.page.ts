import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  standalone: false,
  selector: 'app-akun-saya',
  templateUrl: './akun-saya.page.html',
})
export class AkunSayaPage {
  user: any = {};

  constructor(private api: ApiService) {}

  ionViewWillEnter() {
    this.loadUser();
  }

  async loadUser() {
    const obs = await this.api.getProfile();
    obs.subscribe(res => {
      this.user = res;
    });
  }

  logout() {
    localStorage.clear();
    location.href = '/login';
  }
}
