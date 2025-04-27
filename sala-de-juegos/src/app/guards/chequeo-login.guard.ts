import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const chequeoLoginGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const supabase = authService.supabase;

  const { data: session } = await supabase.auth.getSession();

  if (session.session === null) //no hay sesion activa
  {
    return true;
  }
  return authService.router.parseUrl('/bienvenida'); //hay sesion activa asi que redirijo a bienvenida
};