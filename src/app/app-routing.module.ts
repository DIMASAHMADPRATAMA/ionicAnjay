import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Public pages
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule) },

  // Protected pages (hanya bisa diakses setelah login)
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule), canActivate: [AuthGuard] },
  { path: 'product-detail/:id', loadChildren: () => import('./pages/product-detail/product-detail.module').then(m => m.ProductDetailPageModule), canActivate: [AuthGuard] },
  { path: 'cart', loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartPageModule), canActivate: [AuthGuard] },
  { path: 'checkout', loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutPageModule), canActivate: [AuthGuard] },
  { path: 'riwayat', loadChildren: () => import('./pages/riwayat/riwayat.module').then(m => m.RiwayatPageModule), canActivate: [AuthGuard] },
  { path: 'akun-saya', loadChildren: () => import('./pages/akun-saya/akun-saya.module').then(m => m.AkunSayaPageModule), canActivate: [AuthGuard] },
  { path: 'edit-profil', loadChildren: () => import('./pages/edit-profil/edit-profil.module').then(m => m.EditProfilPageModule), canActivate: [AuthGuard] },
  { path: 'pesan', loadChildren: () => import('./pages/pesan/pesan.module').then(m => m.PesanPageModule), canActivate: [AuthGuard] },
  { path: 'orderan', loadChildren: () => import('./pages/orderan/orderan.module').then(m => m.OrderanPageModule), canActivate: [AuthGuard] },

  // Kalau 'pembayaran' juga butuh proteksi login, tambahkan canActivate
  { path: 'pembayaran', loadChildren: () => import('./pages/pembayaran/pembayaran.module').then(m => m.PembayaranPageModule), canActivate: [AuthGuard] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
