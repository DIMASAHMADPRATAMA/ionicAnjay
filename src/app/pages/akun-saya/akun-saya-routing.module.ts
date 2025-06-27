import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AkunSayaPage } from './akun-saya.page';

const routes: Routes = [
  {
    path: '',
    component: AkunSayaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AkunSayaPageRoutingModule {}
