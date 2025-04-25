import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
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
export class BienvenidaComponent implements OnInit
{
  auth = inject(AuthService);
  db = inject(DatabaseService);
  usuario?: Usuario | null;
  nombreUsuario = signal<any | null>(null);
  juegos = [
    { nombre: 'Ahorcado', icono: 'fas fa-skull-crossbones', ruta: '/ahorcado' },
    { nombre: 'Mayor o Menor', icono: 'fas fa-sort-numeric-up-alt', ruta: '/mayor-o-menor' },
    { nombre: 'Sala de Chat', icono: 'fas fa-comments', ruta: '/sala-de-chat' },
    { nombre: 'Preguntados', icono: 'fas fa-question', ruta: '/preguntados' },
    { nombre: 'Dados Locos', icono: 'fas fa-dice', ruta: '/juego-propio' },
  ];

  async ngOnInit() //tambien se ejectua n veces como pasa en auth service lo de usuario cargado
  {
    // this.auth.supabase.auth.onAuthStateChange(async (event, session) =>
    // {
    //   if (session !== null)
    //   {
    //     this.auth.supabase.auth.getUser().then(async ({data, error}) => {
    //       this.auth.user.set(data.user);
    //       if (data?.user)
    //       {
    //         const { data: usuarios, error: errorUsuario } = await this.auth.supabase.from("Usuarios").select("*").eq("uid", data.user.id).single();
    //         if (errorUsuario)
    //         {
    //           console.error("Error al traer usuario:", errorUsuario.message);
    //           this.usuario = null;
    //         }
    //         else
    //         {
    //           this.usuario = usuarios;
    //           this.nombreUsuario.set(this.usuario?.nombre);
    //           console.log("Usuario cargado:", this.usuario);
    //         }
    //       }
    //     });
    //   }
    //   else
    //   {
    //     this.usuario = null;
    //     console.log('no hay sesion iniciada');
    //   }
    // });
  }

  navegar(ruta: string)
  {
    this.auth.router.navigateByUrl(ruta);
  }
}
