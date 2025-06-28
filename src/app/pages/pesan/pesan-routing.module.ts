import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PesanPage } from './pesan.page';

const routes: Routes = [
  {
    path: '',
    component: PesanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PesanPageRoutingModule {}
