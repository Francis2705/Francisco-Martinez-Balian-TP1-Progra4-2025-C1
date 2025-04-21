import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GithubService } from '../../services/github.service';

@Component({
  selector: 'app-quien-soy',
  imports: [FormsModule],
  templateUrl: './quien-soy.component.html',
  styleUrl: './quien-soy.component.css'
})
export class QuienSoyComponent implements OnInit
{
  apiGithub = inject(GithubService);
  nombreUsuario: string = "Francis2705";

  ngOnInit()
  {
    this.apiGithub.traerPorNombre(this.nombreUsuario);
  }
}

// verificarRespuesta(opcion : string)
  // {
  //   const respuestaCorrecta = 'Brasil';
  //   const resultado : any = document.getElementById('resultado');
  //   const error : any = document.getElementById('error');

  //   if (opcion === respuestaCorrecta)
  //   {
  //       resultado.classList.remove('d-none');
  //       error.classList.add('d-none');
  //   }
  //   else
  //   {
  //       error.classList.remove('d-none');
  //       resultado.classList.add('d-none');
  //   }
  // }