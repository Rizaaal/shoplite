import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdottoPreview } from './prodotto-preview';

describe('ProdottoPreview', () => {
  let component: ProdottoPreview;
  let fixture: ComponentFixture<ProdottoPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdottoPreview],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdottoPreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
