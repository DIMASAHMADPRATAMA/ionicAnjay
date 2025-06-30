import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = '';
  password = '';

  constructor(
    private api: ApiService,
    private storage: Storage,
    private router: Router
  ) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
  }

  login() {
    const credentials = {
      email: this.email,
      password: this.password
    };

    this.api.login(credentials).subscribe({
      next: async res => {
        // ✅ Simpan token dan user ke storage
        await this.storage.set('token', res.token);
        await this.storage.set('user', res.user); // 👈 Tambahan penting!

        // ✅ Arahkan ke halaman home
        this.router.navigate(['/home']);
      },
      error: err => {
        console.error('Login error:', err);
        alert('Login gagal. Cek email & password.');
      }
    });
  }
}
