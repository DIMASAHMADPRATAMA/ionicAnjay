import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  standalone:false,
  selector: 'app-edit-profil',
  templateUrl: './edit-profil.page.html',
  styleUrls: ['./edit-profil.page.scss'],
})
export class EditProfilPage {
  user: any = {
    name: '',
    email: ''
  };

  constructor(
    private api: ApiService,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.api.getProfile().then(obs => {
      obs.subscribe(res => {
        this.user = res;
      });
    });
  }

  async save() {
    const obs = await this.api.updateProfile({ name: this.user.name });
    obs.subscribe(
      async res => {
        await this.showToast('Profil berhasil diperbarui');
        this.router.navigate(['/akun']);
      },
      async err => {
        await this.showToast('Gagal memperbarui profil', 'danger');
      }
    );
  }

  async showToast(msg: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color,
    });
    toast.present();
  }
}
