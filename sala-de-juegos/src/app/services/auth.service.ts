import { Injectable, signal, inject } from '@angular/core';
import { User } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService
{
  supabase = inject(SupabaseService).client;
  user = signal<User | null>(null);
  router = inject(Router);

  constructor()
  {
    this.supabase.auth.onAuthStateChange((event, session) => {
      // console.log(`Auth state change: ${event}`, session);
      if (session === null)
      {
        console.log("No hay sesión activa");
        this.user.set(null);
        // this.router.navigateByUrl('/login'); //sino hay sesion activa, redirige a login
        return;
      }
      else
      {
        this.supabase.auth.getUser().then(({data, error}) => {
          console.log("Sesión activa", data); //se ejecuta dos veces cuando la sesion esta activa
          this.user.set(data.user);
          // this.router.navigateByUrl('/'); //si hay sesion activa, redirige a home (si quiero acceder a home sin sesion activa, redirige a login)
        });
      }
    });
  }

  async crearCuenta(email: string, password: string)
  {
    const {data, error} = await this.supabase.auth.signUp({
      email: email,
      password: password
    });
    return data.user?.id;
  }

  async iniciarSesion(email: string, password: string): Promise<string>
  {
    //verifica si ya hay una sesión activa
    const { data: sessionData } = await this.supabase.auth.getSession();
    if (sessionData.session)
    {
      return "Ya hay una sesión iniciada.";
    }

    //verifica si el correo está registrado en la tabla de usuarios
    const { data: usuarios, error: errorUsuario } = await this.supabase.from("Usuarios").select("correo").eq("correo", email);

    if (!usuarios || usuarios.length === 0)
    {
      return "El correo ingresado no está registrado.";
    }

    //si el correo existe, intentar iniciar sesión
    const { data, error } = await this.supabase.auth.signInWithPassword({email: email, password: password});

    if (error)
    {
      return "Error al iniciar sesión, clave incorrecta" ;
    }

    return "Sesión iniciada correctamente.";
  }

  async cerrarSesion()
  {
    const {error} = await this.supabase.auth.signOut();
  }
}
