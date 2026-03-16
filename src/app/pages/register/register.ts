import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerForm: FormGroup = new FormGroup({
    firstName: new FormControl<string>("", [Validators.required, Validators.minLength(6)]),
    lastName: new FormControl<string>("", [Validators.required, Validators.minLength(6)]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(8)]),
  });

  onLogin(): void {
    if (this.registerForm.valid) {
      const dataLogin = this.registerForm;
      console.log(dataLogin);
    }
  }
}
