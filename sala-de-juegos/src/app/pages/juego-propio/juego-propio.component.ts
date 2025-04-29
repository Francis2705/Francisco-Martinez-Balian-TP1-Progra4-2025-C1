import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';

@Component({
  standalone: true,
  selector: 'app-juego-propio',
  imports: [RouterLink],
  templateUrl: './juego-propio.component.html',
  styleUrl: './juego-propio.component.css'
})
export class JuegoPropioComponent implements OnInit
{
  dado1: number = 1;
  dado2: number = 1;
  lanzando: boolean = false;
  resultado: string = '';
  intentos: number = 0;
  cdr = inject(ChangeDetectorRef);
  auth = inject(AuthService);
  db = inject(DatabaseService);
  gano: boolean = false;

  tiempoInicio: number = 0;
  tiempoTranscurrido: number = 0;
  tiempoFormateado: string = '00:00';
  intervalo: any = null;

  ngOnInit(): void
  {
    this.tiempoInicio = Date.now();
    this.iniciarTemporizador();
  }

  tirarDados()
  {
    this.lanzando = true;
    this.resultado = '';
    this.intentos++;

    setTimeout(() => {
      this.dado1 = this.getNumeroAleatorio();
      this.dado2 = this.getNumeroAleatorio();
      this.lanzando = false;
      this.evaluarResultado();
    }, 1000);
  }

  getNumeroAleatorio(): number
  {
    return Math.floor(Math.random() * 6) + 1;
  }

  async evaluarResultado()
  {
    const suma = this.dado1 + this.dado2;
    if (this.dado1 === this.dado2 && this.dado1 === 6)
    {
      this.resultado = '¡Ganaste con doble 6!';
      this.lanzando = true;
      clearInterval(this.intervalo);

      this.gano = true;
      const usuario = this.auth.user();
      const nombreJugador = usuario?.email || 'Desconocido';
      const duracionSegundos = Math.floor((Date.now() - this.tiempoInicio) / 1000);

      const resultado = {
        jugador: nombreJugador,
        fecha: new Date(),
        gano: this.gano,
        duracion: duracionSegundos
      };

      const { data: info, error: errorInsert } = await this.db.supabase.from('Dados-Locos').insert([resultado]);

      if (errorInsert)
      {
        const { data, error } = await this.db.supabase.from('Dados-Locos').update(resultado).eq('jugador', nombreJugador);
      }
    }
    else if (suma < 4)
    {
      this.resultado = 'Perdiste, la suma fue baja 😢';
      this.lanzando = true;
      clearInterval(this.intervalo);

      this.gano = false;
      const usuario = this.auth.user();
      const nombreJugador = usuario?.email || 'Desconocido';
      const duracionSegundos = Math.floor((Date.now() - this.tiempoInicio) / 1000);

      const resultado = {
        jugador: nombreJugador,
        fecha: new Date(),
        gano: this.gano,
        tiradas: this.intentos,
        duracion: duracionSegundos
      };

      const { data: info, error: errorInsert } = await this.db.supabase.from('Dados-Locos').insert([resultado]);

      if (errorInsert)
      {
        const { data, error } = await this.db.supabase.from('Dados-Locos').update(resultado).eq('jugador', nombreJugador);
      }
    }
    else
    {
      this.resultado = '¡Seguí intentando!';
    }
    this.cdr.detectChanges();
  }

  getRutaDado(numero: number): string
  {
    return `https://hyrqyhaafqgfwofdhqzq.supabase.co/storage/v1/object/public/dados-locos/i-dados/dado${numero}.jpg`;
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