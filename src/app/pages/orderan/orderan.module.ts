import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderanPageRoutingModule } from './orderan-routing.module';

import { OrderanPage } from './orderan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderanPageRoutingModule
  ],
  declarations: [OrderanPage]
})
export class OrderanPageModule {}
