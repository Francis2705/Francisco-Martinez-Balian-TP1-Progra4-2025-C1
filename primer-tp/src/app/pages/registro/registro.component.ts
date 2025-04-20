import { Component, inject, OnInit} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, Form } from '@angular/forms';
import { Usuario } from '../../clases/usuario';
import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit
{
  formulario?: FormGroup;
  usuario?: Usuario; //no lo creo ahora, porque sino siempre que entre al registro se va a estar creando un usuario
  auth = inject(DbService);
  registroExitoso: boolean = false;

  ngOnInit()
  {
    this.formulario = new FormGroup(
    {
      nombre: new FormControl("", { validators: [Validators.minLength(3), Validators.maxLength(15), Validators.required] }),
      apellido: new FormControl("", { validators: [Validators.minLength(3), Validators.maxLength(15), Validators.required] }),
      edad: new FormControl("", { validators: [Validators.min(1), Validators.max(115), Validators.required] })
    });
  }
  guardarDatos()
  {
    if (!this.formulario?.valid) //valida el formulario (dependiendo de los validators que le puse a cada campo)
    {
      console.log("error");
      return;
    }
    this.usuario = new Usuario(this.nombre?.value, this.apellido?.value, this.edad?.value);
    this.auth.insertarUsuario(this.usuario);
    this.registroExitoso = true;
    this.formulario.reset();
  }

  get nombre()
  {
    return this.formulario?.get("nombre");
  }
  get apellido()
  {
    return this.formulario?.get("apellido");
  }
  get edad()
  {
    return this.formulario?.get("edad");
  }
}
