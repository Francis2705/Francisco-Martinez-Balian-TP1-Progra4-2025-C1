import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PostgrestQueryBuilder } from "@supabase/postgrest-js";
import { Usuario } from '../clases/usuario';

@Injectable({
  providedIn: 'root'
})
export class DbService
{
  url: string = "https://klemlcsnkhtgbtptwjxl.supabase.co";
  key: string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtsZW1sY3Nua2h0Z2J0cHR3anhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2ODg0MDYsImV4cCI6MjA2MDI2NDQwNn0.qEVgSGxBzec7i2GoCbUlqI0ovRKfpj1ZSJ0mtld8n1U";
  supabase: SupabaseClient<any, 'public', any>;
  tablaUsuarios: PostgrestQueryBuilder<any, any, "usuarios", unknown>;

  constructor()
  {
    this.supabase = createClient(this.url, this.key);
    this.tablaUsuarios = this.supabase.from("usuarios");
  }

  async insertarUsuario(...usuarios: Usuario[])
  {
    const { data, error } = await this.tablaUsuarios.insert(usuarios);
    console.log(data);
    console.log(error);
  }

  async obtenerUsuarios()
  {
    const { data, error } = await this.tablaUsuarios.select("*");
    console.log(data);
    console.log(error);
    return data;
  }
}
