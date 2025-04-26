import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, RouterLink],
  templateUrl: './preguntados.component.html',
  styleUrls: ['./preguntados.component.css']
})

export class PreguntadosComponent implements OnInit
{
  auth = inject(AuthService);
  db = inject(DatabaseService);
  http = inject(HttpClient);
  cdr = inject(ChangeDetectorRef);
  preguntas: any[] = [];
  indice: number = 0;
  aciertos: number = 0;
  juegoFinalizado: boolean = false;
  gano: boolean = false;
  tiempoInicio: number = 0;
  tiempoTranscurrido: number = 0;
  tiempoFormateado: string = '00:00';
  intervalo: any = null;

  ngOnInit(): void
  {
    this.cargarPreguntas();
  }

  cargarPreguntas(): void
  {
    this.http.get<any[]>('https://the-trivia-api.com/api/questions?limit=5&difficulty=easy').subscribe(res => {
      this.preguntas = res.map(p => ({
        question: this.decodeHtml(p.question),
        correct_answer: this.decodeHtml(p.correctAnswer),
        respuestas: this.shuffle([
          this.decodeHtml(p.correctAnswer),
          ...p.incorrectAnswers.map((r: string) => this.decodeHtml(r))
        ])
      }));
      // console.log('Preguntas cargadas:', this.preguntas);
      this.cdr.detectChanges();
    });
    this.tiempoInicio = Date.now();
    this.iniciarTemporizador();
  }

  responder(opcion: string): void
  {
    if (this.juegoFinalizado) return;
  
    const actual = this.preguntas[this.indice];
  
    if (opcion === actual.correct_answer)
    {
      this.aciertos++;
      if (this.aciertos === 5)
      {
        this.finalizarJuego(true);
      }
      else
      {
        this.indice++;
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

    const { data, error } = await this.db.supabase.from('Preguntados').insert([resultado]);

    if (error)
    {
      await this.db.supabase.from('Preguntados').update(resultado).eq('jugador', nombreJugador);
    }

    clearInterval(this.intervalo);
  }

  shuffle(array: string[]): string[]
  {
    return array.sort(() => Math.random() - 0.5);
  }

  decodeHtml(html: string): string
  {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
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