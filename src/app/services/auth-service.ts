import { inject, Injectable, resource, signal } from '@angular/core';
import { baseApiUrl, localStorageKey, roles } from '../constants';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { CartService } from './cart-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  credentials = signal<Credentials | null>(null);
  cartService = inject(CartService);
  router = inject(Router);

  cliente = resource<Session | null, Credentials | null>({
    params: () => this.credentials(),
    loader: async ({ params }) => {
      if (!params) {
        const localStorageSession = localStorage.getItem(localStorageKey);
        return localStorageSession ? JSON.parse(localStorageSession) : null;
      }

      const localStorageSession = localStorage.getItem(localStorageKey);

      if (localStorageSession) {
        return JSON.parse(localStorageSession) as Session;
      }

      const response = await fetch(`${baseApiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error("Non è stato possibile eseguire l'accesso");
      }

      const session = await response.json();

      const normalizedSession: Session = {
        cliente: session.cliente ?? session.data?.cliente ?? null,
        token: session.token ?? session.data?.token ?? '',
      };

      if (!normalizedSession.token) {
        throw new Error('Token non trovato nella response di login');
      }

      if (!normalizedSession.cliente) {
        throw new Error('Cliente non trovato nella response di login');
      }

      localStorage.setItem(localStorageKey, JSON.stringify(normalizedSession));

      return normalizedSession;
    },
  });

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    const response = await fetch(`${baseApiUrl}/clienti`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        role: payload.role ?? roles.user,
      }),
    });

    if (!response.ok) {
      throw new Error('Non è stato possibile completare la registrazione');
    }

    const result = await response.json();
    return result?.data ?? result;
  }

  getSession(): Session | null {
    const localStorageSession = localStorage.getItem(localStorageKey);
    return localStorageSession ? (JSON.parse(localStorageSession) as Session) : null;
  }

  getToken(): string | null {
    const session = this.getSession();
    return session?.token ?? null;
  }

  getCliente(): Cliente | null {
    const session = this.getSession();
    return session?.cliente ?? null;
  }

  logout() {
    this.credentials.set(null);
    this.cartService.clear();
    localStorage.clear();
    this.router.navigate(['']);
  }

  isLogged(): boolean {
    const session = this.getSession();
    return !!session?.token;
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const tokenData: TokenPayload = jwtDecode(token);
    return tokenData.role === roles.admin;
  }
}

export type Cliente = {
  id?: number;
  nome: string;
  cognome: string;
  email: string;
  indirizzo: string;
  password?: string;
  role: roles.user | roles.admin;
};

export type Session = {
  cliente: Cliente | null;
  token: string;
};

export type RegisterPayload = {
  nome: string;
  cognome: string;
  email: string;
  password: string;
  indirizzo: string;
  role?: roles.user | roles.admin;
};

export type RegisterResponse = {
  id?: number;
  nome: string;
  cognome: string;
  email: string;
  indirizzo: string;
  role: roles.user | roles.admin;
};

export type TokenPayload = {
  id?: number;
  nome: string;
  cognome: string;
  email: string;
  indirizzo?: string;
  role: roles.user | roles.admin;
  iat?: number;
  exp?: number;
};

type Credentials = Pick<Cliente, 'email' | 'password'>;
