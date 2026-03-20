import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { PaymentService } from '../../services/payment';

type PaymentIntentStatus =
  | 'requires_payment_method'
  | 'requires_confirmation'
  | 'requires_action'
  | 'processing'
  | 'requires_capture'
  | 'canceled'
  | 'succeeded';

type OrderDetail = {
  id: number;
  idCliente: number | null;
  emailCliente: string;
  nomeCliente: string | null;
  cognomeCliente: string | null;
  guestToken: string | null;
  stripePaymentIntentId: string | null;
  paymentStatus: PaymentIntentStatus;
  dataOrdine: string;
  stato: string;
  totale: number;
  indirizzoSpedizione: string;
  postalCode: string;
  city: string;
  dettagli: {
    idDettaglio: number;
    idOrdine: number;
    idProdotto: number;
    nomeProdotto: string;
    quantita: number;
    prezzoUnitario: number;
    subtotale: number;
  }[];
};

type PaymentMapStatus = {
  [K in PaymentIntentStatus]: string;
};

@Component({
  selector: 'app-ordine-dettaglio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './ordine-dettaglio.html',
  styleUrl: './ordine-dettaglio.css',
})
export class OrdineDettaglioComponent {
  private route = inject(ActivatedRoute);
  private paymentService = inject(PaymentService);
  statusMap: PaymentMapStatus = {
    succeeded: 'Elaborato',
    processing: 'In elaborazione',
    canceled: 'Cancellato',
    requires_action: "Richiede azioni dell'utente",
    requires_payment_method: 'Metodo di pagamento richiesto',
    requires_confirmation: 'Conferma richiesta',
    requires_capture: 'Richiede cattura',
  };

  ordine = signal<OrderDetail | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor() {
    this.load();
  }

  async load(): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);

      const idParam = this.route.snapshot.paramMap.get('id');
      const guestToken = this.route.snapshot.queryParamMap.get('guestToken');

      if (!idParam) {
        this.error.set('ID ordine mancante');
        return;
      }

      const idOrdine = Number(idParam);

      if (Number.isNaN(idOrdine)) {
        this.error.set('ID ordine non valido');
        return;
      }

      const res = await firstValueFrom(this.paymentService.getOrderDetail(idOrdine, guestToken));

      console.log('ORDER DETAIL RESPONSE:', res);

      const payload = res as any;
      const orderData = payload?.data ?? payload;

      if (!orderData || !orderData.id) {
        this.error.set('Dati ordine non trovati');
        return;
      }

      this.ordine.set(orderData as OrderDetail);
    } catch (err: any) {
      console.error('ORDER DETAIL ERROR:', err);

      this.error.set(
        err?.error?.message || err?.message || 'Errore durante il recupero dell’ordine',
      );
    } finally {
      this.loading.set(false);
    }
  }
}
