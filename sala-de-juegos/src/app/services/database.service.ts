import { Injectable, inject } from '@angular/core';
import { RealtimeChannel} from '@supabase/supabase-js';
import { PostgrestQueryBuilder } from "@supabase/postgrest-js";
import { Usuario } from '../classes/Usuario';
import { SupabaseService } from './supabase.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService
{
  supabase = inject(SupabaseService).client;
  canal: RealtimeChannel;
  tablaUsuarios: PostgrestQueryBuilder<any, any, "Usuarios", unknown>;

  constructor()
  {
    this.tablaUsuarios = this.supabase.from("Usuarios");
    this.canal = this.supabase.channel("schema-db-changes");
  }

  async insertarUsuario(...usuarios: Usuario[])
  {
    const { data, error } = await this.tablaUsuarios.insert(usuarios);
  }

  async listarUsuarios(): Promise<Usuario[] | []>
  {
    const {data, error} = await this.tablaUsuarios.select("uid, correo, nombre, apellido, edad");
    console.log(data);

    if(error)
    {
      return [];
    }

    return data as Usuario[];
  }

//chat

  async obtenerMensajes()
  {
    const { data, error } = await this.supabase.from('Mensajes').select();
    return data || [];
  }

  async guardarMensaje(mensaje: any)
  {
    const { data, error } = await this.supabase.from('Mensajes').insert([mensaje]);
    console.log(error);
    return data;
  }

  suscribirAEventosMensajes(): Observable<any> {
    return new Observable(observer => {
      const channel = this.supabase.channel('chat-messages');

      channel
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'Mensajes',
          },
          (payload) => {
            observer.next(payload.new);
          }
        )
        .subscribe();

      // Limpieza al destruir el observable
      return () => {
        this.supabase.removeChannel(channel);
      };
    });
  }

  //Resultados
  async obtenerResultados(tabla: string): Promise<any[]>
  {
    const {data, error} = await this.supabase.from(tabla).select("*").order('gano', {ascending: false}).order('duracion', {ascending: true});

    if(error)
    {
      return [];
    }

    return data;
  }
}
