import { Injectable, inject } from '@angular/core';
import { RealtimeChannel} from '@supabase/supabase-js';
import { PostgrestQueryBuilder } from "@supabase/postgrest-js";
import { Usuario } from '../classes/Usuario';
import { SupabaseService } from './supabase.service';

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
}
