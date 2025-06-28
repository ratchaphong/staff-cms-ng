import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';
import { Home } from './pages/home/home';
import { authGuard } from './guards/auth.guard';
import { Profile } from './pages/profile/profile';
import { ProductPage } from './pages/product/product';
import { CreateProduct } from './pages/create-product/create-product';
import { EditProduct } from './pages/edit-product/edit-product';
import { LoginHistory } from './pages/login-history/login-history';
import { User } from './pages/user/user';

export const routes: Routes = [
  { path: '', component: Auth },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'product', component: ProductPage, canActivate: [authGuard] },
  {
    path: 'product/create',
    component: CreateProduct,
    canActivate: [authGuard],
  },
  {
    path: 'product/:id',
    component: EditProduct,
    canActivate: [authGuard],
  },
  {
    path: 'login-history',
    component: LoginHistory,
    canActivate: [authGuard],
  },
  {
    path: 'home/:id',
    component: User,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '' },
];
