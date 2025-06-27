import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private storage: Storage, private router: Router) {
    this.initStorage(); // penting
  }

  async initStorage() {
    await this.storage.create(); // initialize dulu
  }

  async canActivate(): Promise<boolean> {
    await this.storage.create(); // jaga-jaga panggil lagi di sini
    const token = await this.storage.get('token');

    if (token) return true;

    this.router.navigate(['/login']);
    return false;
  }
}
