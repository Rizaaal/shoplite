import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Main } from './layout/main/main';
import { Register } from './pages/register/register';
import { Category } from './pages/category/category';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: Main,
    children: [
      { path: 'home', component: Home },
      { path: 'category', component: Category },
    ],
  },
  { path: 'sign-in', component: Login },
  { path: 'sign-up', component: Register },
];
