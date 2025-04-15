import { Component, OnInit} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, Form } from '@angular/forms';
import { Usuario } from '../../clases/usuario';

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

    this.usuario = new Usuario(this.nombre?.value, this.apellido?.value, this.edad?.value); //creo el usuario con los valores del formulario
    console.log(this.usuario); //muestra el usuario creado


    // this.auth.guardarUsuario(this.nombre?.value, this.apellido?.value);
    // console.log(this.auth.usuario); //muestra el usuario guardado en el servicio
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
