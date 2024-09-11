import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlmuerzoPage } from './almuerzo.page';

describe('AlmuerzoPage', () => {
  let component: AlmuerzoPage;
  let fixture: ComponentFixture<AlmuerzoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlmuerzoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
