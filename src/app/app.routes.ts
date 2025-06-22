import { Routes } from '@angular/router';
import { Auth } from './pages/auth/auth';
import { Home } from './pages/home/home';
import { authGuard } from './guards/auth.guard';
import { Profile } from './pages/profile/profile';

export const routes: Routes = [
  { path: '', component: Auth },
  { path: 'home', component: Home, canActivate: [authGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
