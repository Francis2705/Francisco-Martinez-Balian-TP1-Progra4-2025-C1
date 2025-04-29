import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { NgClass, NgIf } from '@angular/common';
import { Carta } from '../../classes/Carta';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mayor-o-menor',
  templateUrl: './mayor-o-menor.component.html',
  styleUrls: ['./mayor-o-menor.component.css'],
  standalone: true,
  imports: [NgClass, NgIf, RouterLink]
})

export class MayorOMenorComponent implements OnInit
{
  mazo: Carta[] = [];
  cartaActual: Carta | null = null;
  cartaSiguiente: Carta | null = null;
  aciertos: number = 0;
  juegoFinalizado: boolean = false;
  gano: boolean = false;
  tiempoInicio: number = 0;
  tiempoTranscurrido: number = 0;
  tiempoFormateado: string = '00:00';
  intervalo: any = null;

  auth = inject(AuthService);
  db = inject(DatabaseService);
  cdr = inject(ChangeDetectorRef);

  ngOnInit(): void
  {
    this.inicializarMazo();
    this.reiniciarJuego();
  }

  inicializarMazo(): void
  {
    const palos = ['corazones'];
    this.mazo = [];

    for (let valor = 1; valor <= 12; valor++)
    {
      for (let palo of palos)
      {
        this.mazo.push({
          valor,
          palo,
          imagen: `https://hyrqyhaafqgfwofdhqzq.supabase.co/storage/v1/object/public/mayor-o-menor/i-mayor-menor/${valor}_de_${palo}.jpg`
        });
      }
    }

    this.mazo = this.mazo.sort(() => Math.random() - 0.5); //baraja el mazo
  }

  reiniciarJuego(): void
  {
    this.aciertos = 0;
    this.juegoFinalizado = false;
    this.gano = false;
    this.cartaActual = this.mazo.shift() || null; //saca la primer carta, q es la q se muestra cuando se empieza a jugar
    this.tiempoInicio = Date.now();
    this.iniciarTemporizador();
  }

  elegir(opcion: 'mayor' | 'menor')
  {
    if (this.juegoFinalizado || this.mazo.length === 0) return;

    this.cartaSiguiente = this.mazo.shift() || null; //recien cuando se toca para comparar, ahi se trae la carta siguiente

    if (!this.cartaActual || !this.cartaSiguiente) return;

    const correcto = (opcion === 'mayor' && this.cartaSiguiente.valor > this.cartaActual.valor) ||
                      (opcion === 'menor' && this.cartaSiguiente.valor < this.cartaActual.valor);

    if (correcto)
    {
      this.aciertos++;
      if (this.aciertos === 5)
      {
        this.finalizarJuego(true);
      } 
      else
      {
        this.cartaActual = this.cartaSiguiente;
        this.cartaSiguiente = null;
      }
    }
    else
    {
      this.finalizarJuego(false);
    }
  }

  async finalizarJuego(gano: boolean)
  {
    this.juegoFinalizado = true;
    this.gano = gano;

    const usuario = this.auth.user();
    const nombreJugador = usuario?.email || 'Desconocido';
    const duracionSegundos = Math.floor((Date.now() - this.tiempoInicio) / 1000);

    const resultado = {
      jugador: nombreJugador,
      fecha: new Date(),
      aciertos: this.aciertos,
      gano: gano,
      duracion: duracionSegundos
    };

    const { data: info, error: errorInsert } = await this.db.supabase.from('Mayor-o-Menor').insert([resultado]);

    if (errorInsert)
    {
      const { data, error } = await this.db.supabase.from('Mayor-o-Menor').update(resultado).eq('jugador', nombreJugador);
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
      this.cdr.detectChanges(); //para que el tiempo se vaya actualizando
    }, 1000);
  }

  formatearTiempo(segundos: number): string
  {
    const mins = Math.floor(segundos / 60).toString().padStart(2, '0');
    const secs = (segundos % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  }
}
