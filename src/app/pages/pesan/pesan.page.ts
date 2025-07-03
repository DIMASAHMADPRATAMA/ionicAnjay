import {
  Component,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  standalone: false,
  selector: 'app-pesan',
  templateUrl: './pesan.page.html',
  styleUrls: ['./pesan.page.scss'],
})
export class PesanPage implements OnDestroy {
  messages: any[] = [];
  message: string = '';
  userId: number = 0;
  adminId: number = 1;
  pollingInterval: any;

  @ViewChild('scrollBottom') scrollBottom!: ElementRef;

  constructor(private api: ApiService, private storage: Storage) {}

  async ionViewWillEnter() {
    await this.storage.create();
    const user = await this.storage.get('user');

    if (user && user.id) {
      this.userId = user.id;
      this.loadMessages();

      this.pollingInterval = setInterval(() => {
        this.loadMessages(false);
      }, 5000);
    } else {
      alert('Gagal mendapatkan ID pengguna.');
    }
  }

  ionViewWillLeave() {
    clearInterval(this.pollingInterval);
  }

  ngOnDestroy() {
    clearInterval(this.pollingInterval);
  }

  loadMessages(scroll: boolean = true) {
    this.api.getMessages(this.adminId).then((obs) => {
      obs.subscribe((res) => {
        const previousLength = this.messages.length;
        this.messages = res;

        if (scroll || previousLength !== this.messages.length) {
          setTimeout(() => this.scrollToBottom(), 100);
        }

        this.api.markMessagesAsRead(this.adminId).then((obs) => {
          obs.subscribe();
        });
      });
    });
  }

  sendMessage() {
    if (!this.message.trim()) return;

    const data = {
      receiver_id: this.adminId,
      message: this.message,
    };

    this.api.sendMessage(data).then((obs) => {
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

  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
