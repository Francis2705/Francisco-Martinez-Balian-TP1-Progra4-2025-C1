import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { BienvenidaComponent } from './pages/bienvenida/bienvenida.component';
import { QuienSoyComponent } from './pages/quien-soy/quien-soy.component';

export const routes: Routes = [
    {path: "login", component: LoginComponent},
    {path: "registro", component: RegistroComponent},
    {path: "bienvenida", component: BienvenidaComponent},
    {path: "quien-soy", component: QuienSoyComponent}
];