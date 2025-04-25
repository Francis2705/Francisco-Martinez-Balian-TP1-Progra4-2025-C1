import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { BienvenidaComponent } from './pages/bienvenida/bienvenida.component';
import { QuienSoyComponent } from './pages/quien-soy/quien-soy.component';
import { AhorcadoComponent } from './pages/ahorcado/ahorcado.component';
import { MayorOMenorComponent } from './pages/mayor-o-menor/mayor-o-menor.component';
import { SalaDeChatComponent } from './pages/sala-de-chat/sala-de-chat.component';
import { JuegoPropioComponent } from './pages/juego-propio/juego-propio.component';
import { PreguntadosComponent } from './pages/preguntados/preguntados.component';
import { chequeoLoginGuard } from './guards/chequeo-login.guard';
import { chequeoJuegosGuard } from './guards/chequeo-juegos.guard';

export const routes: Routes = [
    {path: "login", component: LoginComponent, canActivate: [chequeoLoginGuard]},
    {path: "registro", component: RegistroComponent, canActivate: [chequeoLoginGuard]},
    {path: "bienvenida", component: BienvenidaComponent},
    {path: "quien-soy", component: QuienSoyComponent},
    {path: "ahorcado", component: AhorcadoComponent, canActivate: [chequeoJuegosGuard]},
    {path: "mayor-o-menor", component: MayorOMenorComponent, canActivate: [chequeoJuegosGuard]},
    {path: "sala-de-chat", component: SalaDeChatComponent, canActivate: [chequeoJuegosGuard]},
    {path: "juego-propio", component: JuegoPropioComponent, canActivate: [chequeoJuegosGuard]},
    {path: "preguntados", component: PreguntadosComponent, canActivate: [chequeoJuegosGuard]},
    {path: "", redirectTo: "bienvenida", pathMatch: "full"},
];