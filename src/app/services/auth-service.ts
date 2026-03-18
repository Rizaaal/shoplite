import { inject, Injectable, resource, signal } from '@angular/core';
import { baseApiUrl, localStorageKey, roles } from '../constants';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  credentials = signal<Credentials | null>(null);
  router = inject(Router);

  user = resource<Session | null, Credentials | null>({
    params: () => this.credentials(),
    loader: async ({ params }) => {
      if (!params) return null;

      const localStorageSession = localStorage.getItem(localStorageKey);

      if (localStorageSession) {
        return JSON.parse(localStorageSession);
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
        user: session.user ?? session.data?.user ?? null,
        token: session.token ?? session.data?.token ?? '',
      };

      if (!normalizedSession.token) {
        throw new Error('Token non trovato nella response di login');
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

  getToken(): string | null {
    const localStorageSession = localStorage.getItem(localStorageKey);

    if (!localStorageSession) return null;

    const session: Session = JSON.parse(localStorageSession);
    return session.token ?? null;
  }

  logout() {
    this.credentials.set(null);
    localStorage.removeItem(localStorageKey);
    this.router.navigate(['']);
  }

  isLogged(): boolean {
    return !!localStorage.getItem(localStorageKey);
  }

  isAdmin() {
    const localStorageValue = localStorage.getItem(localStorageKey);

    // se non esiste sicuramente non è admin
    if (!localStorageValue) return false;

    // ottieni i dati dell'utente loggato
    const { token } = JSON.parse(localStorageValue);
    const userData: User = jwtDecode(token);

    return userData.role === roles.admin;
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

export type Session = {
  user: User | null;
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

type Credentials = Pick<User, 'email' | 'password'>;
