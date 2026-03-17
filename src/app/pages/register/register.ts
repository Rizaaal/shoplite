import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { roles } from '../../constants';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal('');

  registerForm: FormGroup = new FormGroup({
    firstName: new FormControl<string>('', [Validators.required]),
    lastName: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl<string>('', [Validators.required]),
  });

  async onRegister(): Promise<void> {
    this.error.set('');

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const value = this.registerForm.getRawValue();

    if (value.password !== value.confirmPassword) {
      this.error.set('Le password non coincidono');
      return;
    }

    try {
      this.loading.set(true);

      await this.authService.register({
        nome: value.firstName!,
        cognome: value.lastName!,
        email: value.email!,
        password: value.password!,
        indirizzo: '',
        role: roles.user,
      });

      this.router.navigate(['/']);
    } catch {
      this.error.set('Errore durante la registrazione');
    } finally {
      this.loading.set(false);
    }
  }
}
