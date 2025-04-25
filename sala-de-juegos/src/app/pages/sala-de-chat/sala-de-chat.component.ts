import { NgClass, NgFor } from '@angular/common';
import { ChangeDetectorRef, Component, inject, NgModule, NgZone, OnChanges, signal, SimpleChanges } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { Router, RouterLink } from '@angular/router';
import { Usuario } from '../../classes/Usuario';

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
  // cdr = inject(ChangeDetectorRef);
  // zone = inject(NgZone);

  mensajes = signal<any[]>([]);  // Mensajes recibidos
  nuevoMensaje: string = '';  // Mensaje que el usuario va a enviar
  usuarioActual?: any;  // Usuario actual

  ngOnInit()
  {
    // Cargar los mensajes y escuchar los nuevos
    this.db.obtenerMensajes().then(mensajes => {
      this.mensajes.set(mensajes);
    });
    
    // Suscribirse a nuevos mensajes en tiempo real
    this.db.suscribirAEventosMensajes().subscribe((mensajeNuevo : any) => {

      
      this.mensajes.update(mensajes => [...mensajes, mensajeNuevo]);
      
    });
    
    // Obtener usuario actual
    this.usuarioActual = this.auth.user();
    // console.log(this.usuarioActual);
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

      console.log(mensaje);
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