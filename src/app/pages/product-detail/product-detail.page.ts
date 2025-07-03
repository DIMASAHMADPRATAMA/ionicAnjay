import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AlertController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss']
})
export class ProductDetailPage {
  product: any;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ionViewWillEnter() {
    const id = this.route.snapshot.paramMap.get('id');
    this.api.getProductById(id).then(obs => {
      obs.subscribe(res => {
        this.product = res;
      });
    });
  }
  selectedSize: string = 'M'; // default ukuran


  async addToCart() {
    if (this.product.stock <= 0) {
      const alert = await this.alertCtrl.create({
        header: 'Stok Habis',
        message: 'Maaf, stok produk ini sudah habis.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    this.api.addToCart({ product_id: this.product.id, quantity: 1 }).then(obs => {
      obs.subscribe(() => {
        this.product.stock--; // update tampilan lokal
        this.router.navigate(['/cart']);
      });
    });
  }

  async goToCheckout() {
    if (this.product.stock <= 0) {
      const alert = await this.alertCtrl.create({
        header: 'Stok Habis',
        message: 'Maaf, stok produk ini sudah habis.',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    // Lanjutkan ke halaman checkout langsung dengan produk & jumlah
    this.router.navigate(['/checkout'], {
      state: {
        product: this.product,
        quantity: 1
      }
    });
  }
  
}
