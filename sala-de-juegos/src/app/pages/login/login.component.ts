import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit
{
  formulario?: FormGroup;
  auth = inject(AuthService);
  db = inject(DatabaseService);
  mensajeLogin = signal<any | null>(null);

  // constructor() //hace que no pueda acceder si ya esta logueado
  // {
  //   this.auth.supabase.auth.onAuthStateChange((event, session) => {
  //     if (session !== null)
  //     {
  //       this.auth.supabase.auth.getUser().then(({data, error}) => {
  //         console.log("Sesión activa", data); //se ejecuta dos veces cuando la sesion esta activa
  //         this.auth.user.set(data.user);
  //         this.auth.router.navigateByUrl('/'); //si hay sesion activa, redirige a bienvenida
  //       }); 
  //     }
  //   });
  // }
  ngOnInit()
  {
    this.formulario = new FormGroup({
      correo: new FormControl('', {validators: [Validators.required, Validators.email]}),
      clave: new FormControl('', {validators: [Validators.required, Validators.minLength(6)]})
    });
  }
  async login()
  {
    const resultado = await this.auth.iniciarSesion(this.correo?.value, this.clave?.value);
    this.mensajeLogin.set(resultado);
    if (this.mensajeLogin() === 'Sesión iniciada correctamente.')
    {
      this.auth.router.navigateByUrl('/bienvenida');
    }
  }

  get correo() {return this.formulario?.get('correo');}
  get clave() {return this.formulario?.get('clave');}
}