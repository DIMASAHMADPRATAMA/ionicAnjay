import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PesanPageRoutingModule } from './pesan-routing.module';

import { PesanPage } from './pesan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PesanPageRoutingModule
  ],
  declarations: [PesanPage]
})
export class PesanPageModule {}
