import { NgClass, NgFor } from '@angular/common';
import { Component, inject, signal, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  auth = inject(AuthService);
  db = inject(DatabaseService);
  mensajes = signal<any[]>([]);
  nuevoMensaje: string = '';
  usuarioActual?: any;
  usuarioClase?: any;

  ngOnInit()
  {
    this.db.obtenerMensajes().then(mensajes => {
      this.mensajes.set(mensajes);
      this.scrollParaAbajo();
    });

    //me suscribo al observable para escuchar y detectar cuando haya cambios (y si los hay, actualizo)
    this.db.suscribirAEventosMensajes().subscribe((mensajeNuevo : any) => {
      this.mensajes.update(mensajes => [...mensajes, mensajeNuevo]);
      this.scrollParaAbajo();
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
        nombre: this.usuarioClase.nombre
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

  convertirAFechaArgentina(fechaUtc: string | Date): string
  {
    const fecha = new Date(fechaUtc);
    fecha.setHours(fecha.getHours() - 3);

    return fecha.toLocaleString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  colorPorNombre(nombre: string): string
  {
    let hash = 0;
    for (let i = 0; i < nombre.length; i++)
    {
      hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 70%)`;
  }

  scrollParaAbajo()
  {
    setTimeout(() => {
      if (this.chatContainer)
      {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 200);
  }
}