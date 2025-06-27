import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { AkunSayaPageRoutingModule } from './akun-saya-routing.module';
import { AkunSayaPage } from './akun-saya.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AkunSayaPageRoutingModule
  ],
  declarations: [AkunSayaPage]
})
export class AkunSayaPageModule {}
