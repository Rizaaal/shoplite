import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdottoForm } from './prodotto-form';

describe('ProdottoForm', () => {
  let component: ProdottoForm;
  let fixture: ComponentFixture<ProdottoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdottoForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdottoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
