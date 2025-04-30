import { Routes } from '@angular/router';
import { chequeoLoginGuard } from './guards/chequeo-login.guard';
import { chequeoJuegosGuard } from './guards/chequeo-juegos.guard';

export const routes: Routes = [
    {path: "login", loadComponent: () => import('./pages/login/login.component')
        .then((modulo) => modulo.LoginComponent), canActivate: [chequeoLoginGuard]},
    {path: "registro", loadComponent: () => import('./pages/registro/registro.component')
        .then((modulo) => modulo.RegistroComponent), canActivate: [chequeoLoginGuard]},
    {path: "bienvenida", loadComponent: () => import('./pages/bienvenida/bienvenida.component')
        .then((modulo) => modulo.BienvenidaComponent)},
    {path: "quien-soy", loadComponent: () => import('./pages/quien-soy/quien-soy.component')
        .then((modulo) => modulo.QuienSoyComponent)},
    {path: "ahorcado", loadComponent: () => import('./pages/ahorcado/ahorcado.component')
        .then((modulo) => modulo.AhorcadoComponent), canActivate: [chequeoJuegosGuard]},
    {path: "mayor-o-menor", loadComponent: () => import('./pages/mayor-o-menor/mayor-o-menor.component')
        .then((modulo) => modulo.MayorOMenorComponent), canActivate: [chequeoJuegosGuard]},
    {path: "sala-de-chat", loadComponent: () => import('./pages/sala-de-chat/sala-de-chat.component')
        .then((modulo) => modulo.SalaDeChatComponent), canActivate: [chequeoJuegosGuard]},
    {path: "juego-propio", loadComponent: () => import('./pages/juego-propio/juego-propio.component')
        .then((modulo) => modulo.JuegoPropioComponent), canActivate: [chequeoJuegosGuard]},
    {path: "preguntados", loadComponent: () => import('./pages/preguntados/preguntados.component')
        .then((modulo) => modulo.PreguntadosComponent), canActivate: [chequeoJuegosGuard]},
    {path: "resultados", loadComponent: () => import('./pages/resultados/resultados.component')
        .then((modulo) => modulo.ResultadosComponent), canActivate: [chequeoJuegosGuard]},
    {path: "reglas", loadComponent: () => import('./pages/reglas/reglas.component')
        .then((modulo) => modulo.ReglasComponent), canActivate: [chequeoJuegosGuard]},
    {path: "", redirectTo: "bienvenida", pathMatch: "full"},
];