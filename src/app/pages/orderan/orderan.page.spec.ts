import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderanPage } from './orderan.page';

describe('OrderanPage', () => {
  let component: OrderanPage;
  let fixture: ComponentFixture<OrderanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
