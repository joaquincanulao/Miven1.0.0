import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CenaPage } from './cena.page';

describe('CenaPage', () => {
  let component: CenaPage;
  let fixture: ComponentFixture<CenaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CenaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
