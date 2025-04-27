import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const chequeoJuegosGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const supabase = authService.supabase;

  const { data: session } = await supabase.auth.getSession();

  if (session.session === null) //no hay sesion activa, asi que redirijo a bienvenida
  {
    return authService.router.parseUrl('/bienvenida');
  }
  return true; //hay sesion activa asi que dejo pasar
};