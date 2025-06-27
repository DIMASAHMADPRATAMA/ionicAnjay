import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule) },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule), canActivate: [AuthGuard] },
  { path: 'product-detail/:id', loadChildren: () => import('./pages/product-detail/product-detail.module').then(m => m.ProductDetailPageModule), canActivate: [AuthGuard] },
  { path: 'cart', loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartPageModule), canActivate: [AuthGuard] },
  { path: 'checkout', loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutPageModule), canActivate: [AuthGuard] },
  { path: 'riwayat', loadChildren: () => import('./pages/riwayat/riwayat.module').then(m => m.RiwayatPageModule), canActivate: [AuthGuard] },
  { path: 'pembayaran',loadChildren: () => import('./pages/pembayaran/pembayaran.module').then( m => m.PembayaranPageModule)},
  { path: 'akun-saya',loadChildren: () => import('./pages/akun-saya/akun-saya.module').then(m => m.AkunSayaPageModule)},
  { path: 'edit-profil',loadChildren: () => import('./pages/edit-profil/edit-profil.module').then( m => m.EditProfilPageModule)
  },
  {
    path: 'pesan',
    loadChildren: () => import('./pages/pesan/pesan.module').then( m => m.PesanPageModule)
  }


];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }