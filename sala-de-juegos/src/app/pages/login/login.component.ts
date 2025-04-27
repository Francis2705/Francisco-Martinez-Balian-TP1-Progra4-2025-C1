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
  mostrarClave: boolean = false;

  ngOnInit()
  {
    this.formulario = new FormGroup({
      correo: new FormControl('', {validators: [Validators.required, Validators.email, Validators.maxLength(50)]}),
      clave: new FormControl('', {validators: [Validators.required, Validators.minLength(6), Validators.maxLength(20)]})
    });
  }

  async login()
  {
    const resultado = await this.auth.iniciarSesion(this.correo?.value, this.clave?.value);
    this.mensajeLogin.set(resultado);
    if (this.mensajeLogin() === 'Sesión iniciada correctamente.')
    {
      setTimeout(() => {
        this.auth.router.navigateByUrl('/bienvenida');
      }, 1000);
    }
  }

  loginRapido(usuario: string)
  {
    this.formulario?.setValue({
      correo: usuario + '@gmail.com',
      clave: 'hola1234'
    });
  }

  verClave()
  {
    this.mostrarClave = !this.mostrarClave;
  }

  get correo() {return this.formulario?.get('correo');}
  get clave() {return this.formulario?.get('clave');}
}