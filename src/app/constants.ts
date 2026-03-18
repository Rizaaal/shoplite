// indirizzo dell'api del server da usare negli endpoint
export const baseApiUrl = 'http://localhost:8080/api';
export enum roles {
  user = 'user',
  admin = 'admin',
}

// fai riferimento a questo per evitare errori nel selezionare gli elementi
// all'interno del localStorage
export const localStorageKey = 'user';
export const cartStorageKey = 'cart';
