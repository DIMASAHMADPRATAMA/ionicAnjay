import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl = 'https://www.sadaraza.my.id/api';

  constructor(private http: HttpClient, private storage: Storage) {}

  async getHeaders(): Promise<HttpHeaders> {
    const token = await this.storage.get('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });
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
    return this.http.get(`${this.apiUrl}/products`, { headers });
  }

  async getProductById(id: any): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.get(`${this.apiUrl}/products/${id}`, { headers });
  }

  // ✅ KERANJANG
  async addToCart(data: any): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.post(`${this.apiUrl}/cart/add`, data, { headers });
  }

  async getCart(): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.get(`${this.apiUrl}/cart`, { headers });
  }

  async removeFromCart(id: number): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.delete(`${this.apiUrl}/cart/${id}`, { headers });
  }

  // ✅ CHECKOUT
  async checkout(data: any): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.post(`${this.apiUrl}/checkout`, data, { headers });
  }

  // ✅ DIRECT CHECKOUT TANPA KERANJANG
  async directCheckout(data: any): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.post(`${this.apiUrl}/checkout/direct`, data, { headers });
  }

  // ✅ MIDTRANS
  async createMidtransTransaction(data: any): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.post(`${this.apiUrl}/midtrans/transaction`, data, { headers });
  }

  async getSnapToken(orderId: string): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.get(`${this.apiUrl}/payment/snap/${orderId}`, { headers });
  }

  // ✅ ORDER USER & ADMIN
  async getUserOrders(): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.get(`${this.apiUrl}/user/orders`, { headers });
  }

  async getAllOrders(): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.get(`${this.apiUrl}/admin/orders`, { headers });
  }

  async updateOrderStatus(id: number, status: string): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.put(`${this.apiUrl}/admin/orders/${id}/status`, { status }, { headers });
  }

  // ✅ ADMIN STATS
  async getAdminStats(): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.get(`${this.apiUrl}/admin/stats`, { headers });
  }

  // ✅ KATEGORI
  async getCategories(): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.get(`${this.apiUrl}/categories`, { headers });
  }

  // ✅ PROFIL USER
  async getProfile(): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }

  async updateProfile(data: any): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.put(`${this.apiUrl}/profile`, data, { headers });
  }

  // ✅ CHAT (Pesan)
  async getMessages(partnerId: number): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.get(`${this.apiUrl}/messages?partner_id=${partnerId}`, { headers });
  }

  async sendMessage(data: { receiver_id: number; message: string }): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.post(`${this.apiUrl}/messages`, data, { headers });
  }

  async getUnreadMessages(userId: number): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.get(`${this.apiUrl}/chat/check-unread/${userId}`, { headers });
  }

  async markMessagesAsRead(partnerId: number): Promise<Observable<any>> {
    const headers = await this.getHeaders();
    return this.http.post(`${this.apiUrl}/chat/mark-read`, { partner_id: partnerId }, { headers });
  }

  // ✅ HELPER MIDTRANS: Menyusun item dari keranjang
  prepareMidtransItems(cartItems: any[]): any[] {
    return cartItems.map(item => ({
      product_id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity
    }));
  }

  // ✅ USER HELPER: Ambil user login dari storage
  async getCurrentUser(): Promise<any> {
    await this.storage.create();
    return await this.storage.get('user');
  }
}
