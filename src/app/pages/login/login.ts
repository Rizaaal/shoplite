import { Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { localStorageKey } from '../../constants';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService);
  router = inject(Router);

  loginForm: FormGroup = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required]),
  });

  constructor() {
    effect(() => {
      // salta l'effetto se non abbiamo chiamato onLogin
      if (!this.authService.credentials()) return;

      if (this.authService.cliente.hasValue()) {
        const user = JSON.stringify(this.authService.cliente.value());
        localStorage.setItem(localStorageKey, user);
        this.router.navigate(['']);
      }
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.authService.credentials.set(this.loginForm.value);
    }
  }
}
