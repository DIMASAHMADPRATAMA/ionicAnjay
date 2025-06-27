import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl = 'http://127.0.0.1:8000/api'; // Ganti jika backend berada di IP/URL lain

  constructor(private http: HttpClient, private storage: Storage) {}

  async getHeaders(): Promise<any> {
    const token = await this.storage.get('token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  // ✅ AUTH
  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }


  // ✅ PRODUK
  async getProducts(): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.get(`${this.apiUrl}/products`, headers);
  }

  async getProductById(id: any): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.get(`${this.apiUrl}/products/${id}`, headers);
  }

  // ✅ KERANJANG
  async addToCart(data: any): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.post(`${this.apiUrl}/cart/add`, data, headers);
  }

  async getCart(): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.get(`${this.apiUrl}/cart`, headers);
  }

  async removeFromCart(id: number): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.delete(`${this.apiUrl}/cart/${id}`, headers);
  }

  // ✅ CHECKOUT
  async checkout(data: any): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.post(`${this.apiUrl}/checkout`, data, headers);
  }

  // ✅ MIDTRANS
  async createMidtransTransaction(data: any): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.post(`${this.apiUrl}/midtrans/transaction`, data, headers);
  }

  async getSnapToken(orderId: string): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.get(`${this.apiUrl}/payment/snap/${orderId}`, headers);
  }

  // ✅ ORDER USER & ADMIN
  async getUserOrders(): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.get(`${this.apiUrl}/user/orders`, headers);
  }

  async getAllOrders(): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.get(`${this.apiUrl}/admin/orders`, headers);
  }

  async updateOrderStatus(id: number, status: string): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.put(`${this.apiUrl}/admin/orders/${id}/status`, { status }, headers);
  }

  // ✅ ADMIN STATS
  async getAdminStats(): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.get(`${this.apiUrl}/admin/stats`, headers);
  }


// ✅ Ambil semua kategori
async getCategories(): Promise<Observable<any>> {
  const headers = await this.getHeaders(); // jika pakai auth
  return this.http.get(`${this.apiUrl}/categories`, headers);
}

  // ✅ PROFIL USER
  async getProfile(): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.get(`${this.apiUrl}/profile`, headers);
  }

  async updateProfile(data: any): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.put(`${this.apiUrl}/profile`, data, headers);
  }


}
