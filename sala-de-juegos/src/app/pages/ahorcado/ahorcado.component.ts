import { Component, OnInit, effect, inject, signal, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-ahorcado',
  imports: [NgFor, NgIf, NgClass, RouterLink],
  templateUrl: './ahorcado.component.html',
  styleUrls: ['./ahorcado.component.css']
})

export class AhorcadoComponent implements OnInit
{
  abecedario: string[] = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  palabra: string = '';
  palabraVisible: string[] = [];
  letrasSeleccionadas: string[] = [];
  errores: number = 0;
  maxErrores: number = 5;
  juegoFinalizado: boolean = false;
  gano: boolean = false;
  imagenActual: string = '';
  palabras: string[] = ['ANGULAR', 'PROGRAMACION', 'JAVASCRIPT', 'DESARROLLO', 'COMPONENTE', 'ÑANDU'];
  tiempoInicio: number = 0;
  tiempoTranscurrido: number = 0;
  tiempoFormateado: string = '00:00';
  intervalo: any = null;
  cdr = inject(ChangeDetectorRef);
  auth = inject(AuthService);
  db = inject(DatabaseService);

  ngOnInit(): void
  {
    this.reiniciarJuego();
  }

  reiniciarJuego(): void
  {
    this.juegoFinalizado = false;
    this.gano = false;
    this.errores = 0;
    this.letrasSeleccionadas = [];
    this.palabra = this.palabras[Math.floor(Math.random() * this.palabras.length)].toUpperCase();
    this.palabraVisible = Array(this.palabra.length).fill('_');
    this.actualizarImagen();
    this.tiempoInicio = Date.now();
    this.tiempoTranscurrido = 0;
    this.iniciarTemporizador();
  }

  seleccionarLetra(letra: string): void
  {
    if (this.juegoFinalizado || this.letrasSeleccionadas.includes(letra)) return;

    this.letrasSeleccionadas.push(letra);

    if (this.palabra.includes(letra))
    {
      this.palabra.split('').forEach((l, i) => {
        if (l === letra)
        {
          this.palabraVisible[i] = letra;
        }
      });
      if (!this.palabraVisible.includes('_'))
      {
        this.finalizarJuego(true);
      }
    }
    else
    {
      this.errores++;
      this.actualizarImagen();
      if (this.errores >= this.maxErrores)
      {
        this.finalizarJuego(false);
      }
    }
  }

  actualizarImagen(): void
  {
    this.imagenActual = `https://hyrqyhaafqgfwofdhqzq.supabase.co/storage/v1/object/public/ahorcado/i-ahorcado/ahorcado${this.errores}.jpg`;
  }

  async finalizarJuego(gano: boolean): Promise<void>
  {
    this.juegoFinalizado = true;
    this.gano = gano;
    const duracionSegundos = Math.floor((Date.now() - this.tiempoInicio) / 1000);
    const usuario = this.auth.user();
    const nombreJugador = usuario?.email || 'Desconocido';

    const resultado = {
      jugador: nombreJugador,
      fecha: new Date(),
      letras_seleccionadas: this.letrasSeleccionadas.length,
      errores: this.errores,
      acierto: gano,
      duracion: duracionSegundos
    };

    const { data: info, error: errorInsert } = await this.db.supabase.from('Ahorcado').insert([resultado]);

    if (errorInsert)
    {
      const { data, error } = await this.db.supabase.from('Ahorcado').update(resultado).eq('jugador', nombreJugador);
    }
    clearInterval(this.intervalo);
  }

  iniciarTemporizador(): void
  {
    if (this.intervalo)
    {
      clearInterval(this.intervalo);
    }
  
    this.intervalo = setInterval(() => {
      this.tiempoTranscurrido = Math.floor((Date.now() - this.tiempoInicio) / 1000);
      this.tiempoFormateado = this.formatearTiempo(this.tiempoTranscurrido);
      this.cdr.detectChanges();
    }, 1000);
  }

  formatearTiempo(segundos: number): string
  {
    const mins = Math.floor(segundos / 60).toString().padStart(2, '0');
    const secs = (segundos % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }
}
