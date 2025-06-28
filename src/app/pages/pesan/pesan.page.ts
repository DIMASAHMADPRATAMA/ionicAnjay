import { Component, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  standalone: false,
  selector: 'app-pesan',
  templateUrl: './pesan.page.html',
  styleUrls: ['./pesan.page.scss'],
})
export class PesanPage {
  messages: any[] = [];
  message: string = '';
  userId: number = 0;
  adminId: number = 1; // bisa diganti dinamis jika perlu

  @ViewChild('scrollBottom') scrollBottom!: ElementRef;

  constructor(private api: ApiService, private storage: Storage) {}

  async ionViewWillEnter() {
    await this.storage.create();
    const user = await this.storage.get('user');
    this.userId = user?.id;

    this.loadMessages();
  }

loadMessages() {
  this.api.getMessages(this.adminId).then(obs => {
    obs.subscribe(res => {
      this.messages = res;
      setTimeout(() => this.scrollToBottom(), 100);
    });
  });


  }

  sendMessage() {
    if (!this.message.trim()) return;

    const data = {
      receiver_id: this.adminId,
      message: this.message
    };

    this.api.sendMessage(data).then(obs => {
      obs.subscribe(() => {
        this.message = '';
        this.loadMessages();
      });
    });
  }

  scrollToBottom() {
    if (this.scrollBottom) {
      this.scrollBottom.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
