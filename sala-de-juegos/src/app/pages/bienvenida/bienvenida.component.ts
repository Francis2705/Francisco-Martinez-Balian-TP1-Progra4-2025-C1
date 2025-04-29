import { Component, inject, signal, effect } from '@angular/core';
import { RouterLink} from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../classes/Usuario';
import { DatabaseService } from '../../services/database.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-bienvenida',
  imports: [RouterLink, NgFor],
  templateUrl: './bienvenida.component.html',
  styleUrl: './bienvenida.component.css'
})
export class BienvenidaComponent
{
  auth = inject(AuthService);
  db = inject(DatabaseService);
  usuario?: Usuario | null;
  nombreUsuario = signal<any | null>(null);
  juegos = [
    { nombre: 'Reglas', icono: 'fas fa-scroll', ruta: '/reglas' },
    { nombre: 'Sala de Chat', icono: 'fas fa-comments', ruta: '/sala-de-chat' },
    { nombre: 'Ahorcado', icono: 'fas fa-skull-crossbones', ruta: '/ahorcado' },
    { nombre: 'Mayor o Menor', icono: 'fas fa-sort-numeric-up-alt', ruta: '/mayor-o-menor' },
    { nombre: 'Preguntados', icono: 'fas fa-question', ruta: '/preguntados' },
    { nombre: 'Dados Locos', icono: 'fas fa-dice', ruta: '/juego-propio' },
    { nombre: 'Resultados', icono: 'fas fa-trophy', ruta: '/resultados' },
  ];

  constructor()
  {
    //uso effect porque al principio el user es null, y effect espera y detecta cuando el usuario se carga
    effect(() => {
      if (this.auth.user())
      {
        console.log("Usuario cargado:", this.auth.user());
        this.setearUsuario(this.auth.user()?.id);
      }
    });
  }

  async setearUsuario(userId: string | undefined)
  {
    const { data, error } = await this.db.supabase.from("Usuarios").select("*").eq("uid", userId).single();

    if (data)
    {
      this.usuario = data;
      this.nombreUsuario.set(this.usuario?.nombre);
    }
    else
    {
      console.error("Error al obtener nombre:", error);
    }
  }

  navegar(ruta: string)
  {
    this.auth.router.navigateByUrl(ruta);
  }
}
