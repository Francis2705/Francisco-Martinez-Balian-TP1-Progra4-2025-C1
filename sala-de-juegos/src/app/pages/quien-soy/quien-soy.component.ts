import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GithubService } from '../../services/github.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-quien-soy',
  imports: [FormsModule, RouterLink],
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