import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Main } from './layout/main/main';
import { Register } from './pages/register/register';
import { Admin } from './pages/admin/admin';
import { authGuard } from './guards/auth-guard';
import { Products } from './pages/products/products';
import { ProductDetail } from './pages/product-detail/product-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: Main,
    children: [
      { path: 'home', component: Home },
      { path: 'admin', canActivate: [authGuard], component: Admin },
      { path: 'products', component: Products },
      { path: 'product-detail/:id', component: ProductDetail },
    ],
      { path: 'products', component: Products },       
      { path: 'product-detail/:id', component: ProductDetail },
    ],
    
  },
  { path: 'sign-in', component: Login },
  { path: 'sign-up', component: Register },
];
