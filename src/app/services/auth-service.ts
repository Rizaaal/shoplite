import { Injectable, resource, signal } from '@angular/core';
import { Product } from '../components/shared/product-card/product-card';
import { baseApiUrl, localStorageKey, roles } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  credentials = signal<Credentials | null>(null);

  user = resource<User, Credentials | null>({
    params: () => this.credentials(),
    loader: async ({ params }) => {
      if (!params) return null;

      const localStorageUser = localStorage.getItem('user');
      console.log(localStorageUser);

      // if user is signed in, return the user
      if (localStorageUser) {
        return JSON.parse(localStorageUser);
      }

      const response = await fetch(`${baseApiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error("Non è stato possibile eseguire l'accesso");
      }

      const session = await response.json();

      return {
        user: this.credentials(),
        token: session.token,
      };
    },
  });

  logout() {
    this.credentials.set(null);
    localStorage.removeItem(localStorageKey);
  }
}

export type User = {
  nome: string;
  cognome: string;
  email: string;
  indirizzo: string;
  password: string;
  role: roles.user | roles.admin;
};

type Credentials = Pick<User, 'email' | 'password'>;
