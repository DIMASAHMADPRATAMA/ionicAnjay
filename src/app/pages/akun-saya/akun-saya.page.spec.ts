import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AkunSayaPage } from './akun-saya.page';

describe('AkunSayaPage', () => {
  let component: AkunSayaPage;
  let fixture: ComponentFixture<AkunSayaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AkunSayaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
