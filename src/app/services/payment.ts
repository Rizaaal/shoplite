import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Observable } from 'rxjs';
import { AuthService } from './auth-service';
import { environment } from '../../environments/environment';
import { Product } from '../components/shared/product-card/product-card';

export type CheckoutPayload = {
  prodotti: {
    idProdotto: number;
    quantita: number;
  }[];
  indirizzoSpedizione: string;
  postalCode: string;
  city: string;
  email?: string;
  nome?: string;
  cognome?: string;
};

export type CheckoutResponse = {
  success: boolean;
  data: {
    idOrdine: number;
    guestToken: string | null;
    clientSecret: string;
  };
};

export type OrderDetailResponse = {
  success: boolean;
  data: {
    id: number;
    idCliente: number | null;
    emailCliente: string;
    nomeCliente: string | null;
    cognomeCliente: string | null;
    guestToken: string | null;
    stripePaymentIntentId: string | null;
    paymentStatus: string;
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
};

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private stripePromise = loadStripe(environment.stripePublicKey);

  getStripe(): Promise<Stripe | null> {
    return this.stripePromise;
  }

  createCheckout(payload: CheckoutPayload): Observable<CheckoutResponse> {
    const token = this.authService.getToken();

    const headers = token
      ? new HttpHeaders({
          Authorization: `Bearer ${token}`,
        })
      : undefined;

    return this.http.post<CheckoutResponse>(`${environment.apiUrl}/ordini/checkout`, payload, {
      headers,
    });
  }

  buildPayload(cart: Product[], form: any, isLogged: boolean): CheckoutPayload {
    return {
      prodotti: cart.map((p) => ({
        idProdotto: p.id,
        quantita: p.stock,
      })),
      indirizzoSpedizione: form.indirizzoSpedizione,
      postalCode: form.postalCode,
      city: form.city,
      ...(isLogged
        ? {}
        : {
            email: form.email,
            nome: form.nome,
            cognome: form.cognome,
          }),
    };
  }

  getOrderDetail(idOrdine: number, guestToken?: string | null) {
    const token = this.authService.getToken();

    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    if (guestToken) {
      headers = headers.set('x-guest-token', guestToken);
    }

    return this.http.get(`${environment.apiUrl}/ordini/${idOrdine}`, {
      headers,
    });
  }

  confirmPayment(payload: {
    idOrdine: number;
    paymentIntentId: string;
    guestToken?: string | null;
  }) {
    const token = this.authService.getToken();

    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    if (payload.guestToken) {
      headers = headers.set('x-guest-token', payload.guestToken);
    }

    return this.http.post(
      `${environment.apiUrl}/ordini/${payload.idOrdine}/conferma-pagamento`,
      {
        paymentIntentId: payload.paymentIntentId,
        metodo: 'card',
        guestToken: payload.guestToken ?? null,
      },
      { headers },
    );
  }
}
