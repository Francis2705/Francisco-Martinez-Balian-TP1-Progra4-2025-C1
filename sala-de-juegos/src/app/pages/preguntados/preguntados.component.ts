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
  respuestaSeleccionada: string | null = null;

  ngOnInit(): void
  {
    this.cargarPreguntas();
  }

  cargarPreguntas()
  {
    this.http.get<any[]>('https://the-trivia-api.com/api/questions?limit=5&difficulty=easy').subscribe(async res => {

      this.preguntas = res.map(p => ({ //para cada opcion del array...
        question: this.decodearHtml(p.question), //decodea la pregunta
        correct_answer: this.decodearHtml(p.correctAnswer), //decodea la respuesta
        respuestas: this.desordenarArray([ //junto la respuesta correcta con las incorrectas y las mezclo para que salgan en distinto orden 
          this.decodearHtml(p.correctAnswer),
          ...p.incorrectAnswers.map((r: string) => this.decodearHtml(r))
        ])
      }));
      console.log(this.preguntas);
      this.cdr.detectChanges();
    });
    this.tiempoInicio = Date.now();
    this.iniciarTemporizador();
  }

  async responder(opcion: string)
  {
    if (this.juegoFinalizado || this.respuestaSeleccionada) return;

    this.respuestaSeleccionada = opcion;
    const actual = this.preguntas[this.indice];
    const esCorrecta = opcion === actual.correct_answer;

    setTimeout(async () => {
      if (esCorrecta)
      {
        this.aciertos++;
        if (this.aciertos === 5)
        {
          this.finalizarJuego(true);
        }
        else
        {
          this.indice++;
          this.respuestaSeleccionada = null;
        }
      }
      else
      {
        await this.finalizarJuego(false);
      }
    }, 400);
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
    this.cdr.detectChanges();
  }

  desordenarArray(array: string[]): string[]
  {
    return array.sort(() => Math.random() - 0.5); //desordena el array al azar
  }

  decodearHtml(html: string): string
  {
    //decodea lo que llega -> decodeHtml('¿Cu&aacute;l es la capital de Francia?') => '¿Cuál es la capital de Francia?'
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