import { Component, inject, InjectionToken, OnInit, signal} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Usuario } from '../../classes/Usuario';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit
{
  formulario?: FormGroup;
  usuario?: Usuario;
  auth = inject(AuthService);
  db = inject(DatabaseService);
  registro = signal<any | null>(null);
  mensajeLogin = signal<any | null>(null);

  // constructor() //hace que no pueda acceder si ya esta logueado
  // {
  //   this.auth.supabase.auth.onAuthStateChange((event, session) => {
  //     if (session !== null)
  //     {
  //       this.auth.supabase.auth.getUser().then(({data, error}) => {
  //         console.log("Sesión activa", data); //se ejecuta dos veces cuando la sesion esta activa
  //         this.auth.user.set(data.user);
  //         this.auth.router.navigateByUrl('/'); //si hay sesion activa, redirige a home
  //       }); 
  //     }
  //   });
  // }
  ngOnInit()
  {
    this.formulario = new FormGroup({
      correo: new FormControl('', {validators: [Validators.required, Validators.email]}),
      nombre: new FormControl('', {validators: [Validators.minLength(3), Validators.maxLength(15), Validators.required]}),
      apellido: new FormControl('', {validators: [Validators.minLength(3), Validators.maxLength(15), Validators.required]}),
      edad: new FormControl('', {validators: [Validators.min(1), Validators.max(115), Validators.required]}),
      clave: new FormControl('', {validators: [Validators.required, Validators.minLength(6)]})
    });
  }
  async guardarDatos()
  {
    if (!this.formulario?.valid)
    {
      return this.registro.set('form invalido');
    }
    else
    {
      //valido si ya existe el mail
      const { data: usuarios, error: errorUsuario } = await this.auth.supabase.from("Usuarios").select("correo").eq("correo", this.correo?.value);
      if (usuarios?.length === 1)
      {
        return this.registro.set('usuario registrado');
      }
      else
      {
        //sino existe, creo la cuenta
        let uid = await this.auth.crearCuenta(this.correo?.value, this.clave?.value);
        if (uid === -1)
        {
          return this.registro.set('Error, mail inexistente!');
        }
        this.usuario = new Usuario(this.correo?.value, this.nombre?.value, this.apellido?.value, this.edad?.value, uid);
        this.db.insertarUsuario(this.usuario);
        this.registro.set('registro exitoso');
        setTimeout(() => {this.auth.router.navigateByUrl('/login');}, 2000); //espero 2 segundos para que se vea el mensaje
        return;
      }
    }
  }

  get correo() {return this.formulario?.get('correo');}
  get nombre() {return this.formulario?.get('nombre');}
  get apellido() {return this.formulario?.get('apellido');}
  get edad() {return this.formulario?.get('edad');}
  get clave() {return this.formulario?.get('clave');}
}
