import { Component, inject, OnInit, signal} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Usuario } from '../../classes/Usuario';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit
{
  formulario?: FormGroup;
  usuario?: Usuario;
  auth = inject(AuthService);
  db = inject(DatabaseService);
  registro = signal<any | null>(null); //si no esta como signal, no carga el texto de error o exito (en login pasa lo mismo)
  mensajeLogin = signal<any | null>(null);
  mostrarClave: boolean = false;

  ngOnInit()
  {
    this.formulario = new FormGroup({
      correo: new FormControl('', {validators: [Validators.required, Validators.email, Validators.maxLength(50)]}),
      nombre: new FormControl('', {validators: [Validators.minLength(3), Validators.maxLength(15), Validators.required]}),
      apellido: new FormControl('', {validators: [Validators.minLength(3), Validators.maxLength(25), Validators.required]}),
      edad: new FormControl('', {validators: [Validators.min(4), Validators.max(115), Validators.required]}),
      clave: new FormControl('', {validators: [Validators.required, Validators.minLength(6), Validators.maxLength(20)]})
    });
  }

  async guardarDatos()
  {
    if (!this.formulario?.valid)
    {
      return this.registro.set('Error, formulario inválido');
    }

    const { data: usuarios, error: errorUsuario } = await this.auth.supabase.from("Usuarios").select("correo").eq("correo", this.correo?.value);
    if (usuarios?.length === 1) //valido si ya existe el mail
    {
      return this.registro.set('Error, usuario ya registrado');
    }

    let uid = await this.auth.crearCuenta(this.correo?.value, this.clave?.value);
    this.usuario = new Usuario(this.correo?.value, this.nombre?.value, this.apellido?.value, this.edad?.value, uid);
    this.db.insertarUsuario(this.usuario);
    this.registro.set('registro exitoso');
    this.auth.iniciarSesion(this.correo?.value, this.clave?.value);
    setTimeout(() => {
      this.auth.router.navigateByUrl('/bienvenida');
    }, 2000);
    return;
  }

  verClave()
  {
    this.mostrarClave = !this.mostrarClave;
  }

  get correo() {return this.formulario?.get('correo');}
  get nombre() {return this.formulario?.get('nombre');}
  get apellido() {return this.formulario?.get('apellido');}
  get edad() {return this.formulario?.get('edad');}
  get clave() {return this.formulario?.get('clave');}
}
