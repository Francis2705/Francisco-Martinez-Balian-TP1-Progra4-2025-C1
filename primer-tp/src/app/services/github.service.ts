import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubService
{
  httpClient = inject(HttpClient); //injectar el servicio de HTTPClient (dentro de un servicio estoy injectando el servicio de httpClient)
  usuGithub: any;

  traerPorNombre(usuarioElegido: string)
  {
    const peticion: Observable<any> = this.httpClient.get<any>("https://api.github.com/users/" + usuarioElegido)

    const suscripcion: Subscription = peticion.subscribe((respuesta) => { //suscribirse y definir accion al recibir respuesta
      this.usuGithub = respuesta; 
      suscripcion.unsubscribe(); //me desuscribo para no seguir escuchando el evento
    });
  }
}
