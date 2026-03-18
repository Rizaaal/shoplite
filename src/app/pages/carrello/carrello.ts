import { AfterViewInit, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';

import { CartService } from '../../services/cart-service';
import { Product } from '../../components/shared/product-card/product-card';
import { AuthService } from '../../services/auth-service';
import { PaymentService } from '../../services/payment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrello.html',
  styleUrl: './carrello.css',
})
export class Carrello implements AfterViewInit {
  router = inject(Router);
  cartService = inject(CartService);
  authService = inject(AuthService);
  paymentService = inject(PaymentService);

  cartItems = computed(() => this.cartService.items());

  total = computed(() => this.cartItems().reduce((sum, item) => sum + item.prezzo * item.stock, 0));

  stripe = signal<Stripe | null>(null);
  elements = signal<StripeElements | null>(null);
  cardElement = signal<StripeCardElement | null>(null);

  stripeReady = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);

  form = signal({
    nome: '',
    cognome: '',
    email: '',
    indirizzoSpedizione: '',
    postalCode: '',
    city: '',
  });

  isLogged = () => this.authService.isLogged();

  async ngAfterViewInit(): Promise<void> {
    if (this.cartItems().length === 0) return;
    await this.initStripe();
  }

  increaseQty(item: Product): void {
    this.cartService.updateQty(item.id, item.stock + 1);
  }

  decreaseQty(item: Product): void {
    if (item.stock > 1) {
      this.cartService.updateQty(item.id, item.stock - 1);
    }
  }

  removeItem(id: number): void {
    this.cartService.remove(id);
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  updateField(key: keyof ReturnType<typeof this.form>, value: string): void {
    this.form.update((current) => ({
      ...current,
      [key]: value,
    }));
  }

  private async initStripe(): Promise<void> {
    const stripe = await this.paymentService.getStripe();

    if (!stripe) {
      this.error.set('Stripe non inizializzato correttamente');
      return;
    }

    this.stripe.set(stripe);

    const elements = stripe.elements({
      locale: 'it',
    });

    this.elements.set(elements);

    const card = elements.create('card', {
      hidePostalCode: true,
      style: {
        base: {
          color: '#000000',
          fontSize: '18px',
          fontFamily: 'Arial, sans-serif',
          fontSmoothing: 'antialiased',
          iconColor: '#000000',
          '::placeholder': {
            color: '#64748b',
          },
        },
        invalid: {
          color: '#dc2626',
          iconColor: '#dc2626',
        },
      },
    });

    setTimeout(() => {
      const mountPoint = document.getElementById('card-element');

      if (!mountPoint) {
        this.error.set('Contenitore carta non trovato');
        return;
      }

      card.mount('#card-element');

      card.on('change', (event) => {
        this.error.set(event.error?.message ?? null);
      });

      this.cardElement.set(card);
      this.stripeReady.set(true);
    });
  }

  private validateForm(): boolean {
    const currentForm = this.form();

    if (!currentForm.indirizzoSpedizione || !currentForm.postalCode || !currentForm.city) {
      this.error.set('Compila indirizzo, CAP e città');
      return false;
    }

    if (!this.isLogged() && !currentForm.email) {
      this.error.set('Per il guest checkout l’email è obbligatoria');
      return false;
    }

    return true;
  }

  async checkout(): Promise<void> {
    this.error.set(null);

    if (this.cartItems().length === 0) {
      this.error.set('Il carrello è vuoto');
      return;
    }

    if (!this.validateForm()) return;

    const stripe = this.stripe();
    const card = this.cardElement();

    if (!stripe || !card) {
      this.error.set('Pagamento con carta non disponibile');
      return;
    }

    this.loading.set(true);

    try {
      const payload = this.paymentService.buildPayload(
        this.cartItems(),
        this.form(),
        this.isLogged(),
      );

      const res = await firstValueFrom(this.paymentService.createCheckout(payload));

      const checkoutData = (res as any)?.data ?? res;

      if (!checkoutData?.clientSecret) {
        this.error.set('clientSecret non trovato nella response del checkout');
        return;
      }

      const { clientSecret, idOrdine, guestToken } = checkoutData;

      const billingName = `${this.form().nome} ${this.form().cognome}`.trim();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
          billing_details: {
            name: billingName || undefined,
            email: !this.isLogged() ? this.form().email || undefined : undefined,
          },
        },
      });

      if (result.error) {
        this.error.set(result.error.message ?? 'Errore pagamento');
        return;
      }

      if (
        result.paymentIntent?.status === 'succeeded' ||
        result.paymentIntent?.status === 'processing'
      ) {
        if (result.paymentIntent?.id) {
          await firstValueFrom(
            this.paymentService.confirmPayment({
              idOrdine,
              paymentIntentId: result.paymentIntent.id,
              guestToken,
            }),
          );
        }

        this.cartService.clear();

        await this.router.navigate([`/ordini/${idOrdine}`], {
          queryParams: guestToken ? { guestToken } : {},
        });

        return;
      }

      this.error.set('Pagamento non completato');
    } catch (e: unknown) {
      console.log('CHECKOUT ERROR:', e);
      this.error.set(e instanceof Error ? e.message : 'Errore durante il checkout');
    } finally {
      this.loading.set(false);
    }
  }
}
