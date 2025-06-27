import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  name = '';
  email = '';
  password = '';

  constructor(private api: ApiService, private router: Router) {}

  register() {
    if (!this.name || !this.email || !this.password) {
      alert('Harap isi semua kolom.');
      return;
    }

    this.api.register({
      name: this.name,
      email: this.email,
      password: this.password,
    }).subscribe({
      next: () => {
        alert('Berhasil daftar! Silakan login.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Gagal daftar:', err);
        alert('Gagal daftar. Silakan coba lagi.');
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
