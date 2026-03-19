# Shoplite

## Membri
Damilola Abiola Wiwoloku - fullstack - 
Michele Papa - fullstack - 
Anass - fullstack -
Gabriele Di Grazia - fullstack - gabrieldigrazia@protonmail.com

## Descrizione
Semplice e-commerce di articoli di informatica e di tecnologia. Contiene una pagina per filtrare e cercare gli articoli per nome, range di prezzo e categoria. qualsiasi visitatore può comprare gli articoli inserendo i dati della carta di credito, con il pagamento gestito da stripe. Si può anche eseguire la registrazione al sito, in modo da poter salvare le proprie informazioni di pagamento. Gli admin possono gestire gli articoli del sito dal pannello admin, creando e modificando o rimuovendo gli articoli esistenti con un interfaccia facile da utilizzare. Le immagini sono hostate con Cloudnary.

## Istruzioni per l'avvio del progetto

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.


### Building

To build the project run:

```bash
ng build
```

### Backend
Il backend si trova all'interno della cartella di progetto in /backend.

 ```bash
cd backend
```
Quindi installare i pacchetti

### Inizializzare il DB
Se il DB non viene inizializzato all'avvio del server,
avviare un server di sql manualmente, e quindi creare il database `shoplite`.
Quindi importare il database dal file `shoplite.sql`.

### Variabili d'ambiente
è necessario un file .env per avviare il DB ed avere le chiavi dei servizi di stripe e cloudinary.
(i dati del DB possono naturalmente essere cambiati in base alle config del DB)

```bash
DB_USER=root
DB_PASSWORD #in XAMPP la pass è vuota
DB_NAME=shoplite
DB_PORT=3306
SECRET_KEY #chiave JWTtoken, inserire un valore qualsiasi
STRIPE_SECRET_KEY = sk_test_51TAToaA7OuLNQsokYFm5W7GcMq0loiLqfHUcAe7Q56hRmJpcj08h17EjCR6TFHVngN7wZPdaizuUIThmaHD2eq5400bRcfdWD9

# per le chiavi cloudinary contattare il team
CLOUDINARY_API_KEY  
CLOUDINARY_API_SECRET  
CLOUDINARY_CLOUD_NAME 
```

A questo punto avviare il dev server con `npm run dev`.

