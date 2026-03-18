import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProdottoPage } from './create-prodotto-page';

describe('CreateProdottoPage', () => {
  let component: CreateProdottoPage;
  let fixture: ComponentFixture<CreateProdottoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProdottoPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProdottoPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
