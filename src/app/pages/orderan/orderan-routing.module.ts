import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderanPage } from './orderan.page';

const routes: Routes = [
  {
    path: '',
    component: OrderanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderanPageRoutingModule {}
