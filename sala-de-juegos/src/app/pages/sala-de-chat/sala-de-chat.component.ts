import { NgClass, NgFor } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sala-de-chat',
  imports: [NgClass, NgFor, FormsModule, RouterLink],
  templateUrl: './sala-de-chat.component.html',
  styleUrl: './sala-de-chat.component.css'
})
export class SalaDeChatComponent
{
  auth = inject(AuthService);
  db = inject(DatabaseService);
  mensajes = signal<any[]>([]);
  nuevoMensaje: string = '';
  usuarioActual?: any;
  usuarioClase?: any;
  nombreUsuario = signal<any[]>([]);

  ngOnInit()
  {
    this.db.obtenerMensajes().then(mensajes => {
      this.mensajes.set(mensajes);
    });

    this.db.suscribirAEventosMensajes().subscribe((mensajeNuevo : any) => {
      this.mensajes.update(mensajes => [...mensajes, mensajeNuevo]);
    });

    this.usuarioActual = this.auth.user();
    this.setearUsuario(this.auth.user()?.id);
  }

  async setearUsuario(userId: string | undefined)
  {
    const { data, error } = await this.db.supabase.from("Usuarios").select("*").eq("uid", userId).single();

    if (data)
    {
      this.usuarioClase = data;
      this.nombreUsuario.set(this.usuarioClase?.nombre);
    }
    else
    {
      console.error("Error al obtener nombre:", error);
    }
  }

  async enviarMensaje()
  {
    if (this.nuevoMensaje.trim() !== '')
    {
      const mensaje = {
        usuario: this.usuarioActual?.email,
        contenido: this.nuevoMensaje,
        fecha: new Date(),
      };

      await this.db.guardarMensaje(mensaje).then(() => {
        this.nuevoMensaje = '';
      });
    }

    setTimeout(async () => {
      await this.db.obtenerMensajes().then(mensajes => {
        this.mensajes.set(mensajes);
      });
    }, 1000);
  }
}