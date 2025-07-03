import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-akun-saya',
  templateUrl: './akun-saya.page.html',
})
export class AkunSayaPage {
  user: any = {};

  constructor(
    private api: ApiService,
    private storage: Storage,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.loadUser();
  }

  async loadUser() {
    await this.storage.create();
    this.user = await this.storage.get('user');
  }

  async logout() {
    await this.storage.create();
    await this.storage.clear(); // hapus token & user
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
