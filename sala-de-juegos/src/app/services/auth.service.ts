import { Injectable, signal, inject, OnInit } from '@angular/core';
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
      if (session === null)
      {
        console.log("No hay sesión activa");
        this.user.set(null);
        return;
      }
      this.supabase.auth.getUser().then(({data, error}) => {
        console.log("Sesión activa", data);
        this.user.set(data.user);
      });
    });
  }

  async crearCuenta(email: string, password: string)
  {
    const {data, error} = await this.supabase.auth.signUp({
      email: email,
      password: password
    });
    if (error?.name === 'AuthApiError')
    {
      return -1;
    }
    return data.user?.id;
  }

  async iniciarSesion(email: string, password: string): Promise<string>
  {
    const { data: usuarios, error: errorUsuario } = await this.supabase.from("Usuarios").select("correo").eq("correo", email);
    if (!usuarios || usuarios.length === 0) //verifica si el correo esta registrado en la tabla de usuarios
    {
      return "El correo ingresado no está registrado.";
    }

    const { data, error } = await this.supabase.auth.signInWithPassword({email: email, password: password});
    if(error?.message === 'Invalid login credentials') //si el correo existe, intentar iniciar sesion
    {
      return "Error, contraseña incorrecta";
    }

    return "Sesión iniciada correctamente.";
  }

  async cerrarSesion()
  {
    const {error} = await this.supabase.auth.signOut();
  }
}
