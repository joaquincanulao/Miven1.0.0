import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddRecetasPage } from './add-recetas.page';

describe('AddRecetasPage', () => {
  let component: AddRecetasPage;
  let fixture: ComponentFixture<AddRecetasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRecetasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
