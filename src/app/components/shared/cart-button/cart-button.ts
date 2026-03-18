import { Component, input, signal } from '@angular/core';
import { StarIcon } from '../../icons/star/star';

@Component({
  selector: 'app-cart-button',
  imports: [StarIcon],
  templateUrl: './cart-button.html',
  styleUrl: './cart-button.css',
})
export class CartButton {
  addedToCart = signal<boolean>(false);
  isdisabled = input(false);

  toggleStyle() {
    // cambia stile bottone quando si aggiunge al carrello
    this.addedToCart.set(true);

    setTimeout(() => {
      this.addedToCart.set(false);
    }, 1500);
  }
}
