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
  supabase = inject(SupabaseService).client; //del servicio de supabase, me traigo el cliente que es por el cual voy a hacer las peticiones
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

  async obtenerMensajes()
  {
    const { data, error } = await this.supabase.from('Mensajes').select();
    return data || [];
  }

  async guardarMensaje(mensaje: any)
  {
    const { data, error } = await this.supabase.from('Mensajes').insert([mensaje]);
    return data;
  }

  suscribirAEventosMensajes(): Observable<any>
  {
    return new Observable(observable => { //crea un obervable y observable es quien se encarga de avisar cuando lleguen nuevos datos
      const canalMensajes = this.supabase.channel('chat');
      canalMensajes.on( //se configura el canal para reaccionar cuando haya cambios en la bd
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'Mensajes',
          },
          (payload) => { //aca adentro se configura q hacer cada vez que hay un nuevo mensaje en la bd
            observable.next(payload.new); //observable.next envia el mensaje a quien este suscripto
          } //payload.new es el nuevo mensaje que se registro
        ).subscribe(); //este subscribe es para suscribirme a canal de supabase, conecta el observable con supabase (para cambios en la bd)

      return () => { //es una funcion de limpieza que se ejecuta cuando ya no se quiere escuchar mas el evento
        this.supabase.removeChannel(canalMensajes); //le dice a supabase que ya no quiere seguir escuchando este canal
      };
    });
  }

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
