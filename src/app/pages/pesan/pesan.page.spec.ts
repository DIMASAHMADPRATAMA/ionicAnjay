import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PesanPage } from './pesan.page';

describe('PesanPage', () => {
  let component: PesanPage;
  let fixture: ComponentFixture<PesanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PesanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
