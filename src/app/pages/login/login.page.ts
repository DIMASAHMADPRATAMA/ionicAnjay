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
    this.api.login({ email: this.email, password: this.password }).subscribe({
      next: async res => {
        await this.storage.set('token', res.token);
        this.router.navigate(['/home']);
      },
      error: err => {
        console.error('Login error:', err);
        alert('Login gagal. Cek email & password.');
      }
    });
  }
}
