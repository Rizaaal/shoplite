import { Injectable, resource, signal } from '@angular/core';
import { baseApiUrl, localStorageKey, roles } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  credentials = signal<Credentials | null>(null);

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

  getToken(): string | null {
    const localStorageSession = localStorage.getItem(localStorageKey);

    if (!localStorageSession) return null;

    const session: Session = JSON.parse(localStorageSession);
    return session.token ?? null;
  }

  logout() {
    this.credentials.set(null);
    localStorage.removeItem(localStorageKey);
  }

  isLogged() {
    return !!localStorage.getItem(localStorageKey);
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

type Credentials = Pick<User, 'email' | 'password'>;
