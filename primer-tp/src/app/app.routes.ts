import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { BienvenidaComponent } from './pages/bienvenida/bienvenida.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { SobreMiComponent } from './pages/sobre-mi/sobre-mi.component';

export const routes: Routes = [
    {path: "login", component: LoginComponent},
    {path: "bienvenida", component: BienvenidaComponent},
    {path: "registro", component: RegistroComponent},
    {path: "sobre-mi", component: SobreMiComponent},
    {path: "", redirectTo: "bienvenida", pathMatch: "full"}
];