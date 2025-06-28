// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const loggedIn = authStore.isLoggedIn();
  console.log('🔒 Auth Guard - Logged In:', loggedIn);

  if (!loggedIn) {
    router.navigate(['']);
    return false;
  }

  return true;
};
