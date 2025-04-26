import { Component, inject, signal } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { FormsModule } from '@angular/forms';
import { NgFor} from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-resultados',
  imports: [FormsModule, NgFor, RouterLink],
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.css'
})
export class ResultadosComponent
{
  db = inject(DatabaseService);

  resultadosAhorcado = signal<any[]>([]);
  resultadosDadosLocos = signal<any[]>([]);
  resultadosMayorMenor = signal<any[]>([]);
  resultadosPreguntados = signal<any[]>([]);

  ngOnInit()
  {
    this.cargarResultados();
  }

  async cargarResultados()
  {
    const resulAhorcado = await this.db.obtenerResultados('Ahorcado');
    this.resultadosAhorcado.set(resulAhorcado);

    const resulDadosLocos = await this.db.obtenerResultados('Dados-Locos');
    this.resultadosDadosLocos.set(resulDadosLocos);

    const resulMayorMenor = await this.db.obtenerResultados('Mayor-o-Menor');
    this.resultadosMayorMenor.set(resulMayorMenor);

    const resulPreguntados = await this.db.obtenerResultados('Preguntados');
    this.resultadosPreguntados.set(resulPreguntados);
  }
}