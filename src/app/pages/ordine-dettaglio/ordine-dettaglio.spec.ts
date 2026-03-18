import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdineDettaglioComponent } from './ordine-dettaglio';

describe('OrdineDettaglioComponent', () => {
  let component: OrdineDettaglioComponent;
  let fixture: ComponentFixture<OrdineDettaglioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdineDettaglioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdineDettaglioComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
