import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdottiList } from './prodotti-list';

describe('ProdottiList', () => {
  let component: ProdottiList;
  let fixture: ComponentFixture<ProdottiList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdottiList],
    }).compileComponents();

    fixture = TestBed.createComponent(ProdottiList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
