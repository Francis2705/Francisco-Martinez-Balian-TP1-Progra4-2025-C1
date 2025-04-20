import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GithubService } from '../../services/github.service';

@Component({
  selector: 'app-sobre-mi',
  imports: [FormsModule],
  templateUrl: './sobre-mi.component.html',
  styleUrl: './sobre-mi.component.css'
})
export class SobreMiComponent
{
  apiGithub = inject(GithubService);
  cdr = inject(ChangeDetectorRef);
  // nombreUsuario: string = "";
  nombreUsuario: string = "Francis2705";

  traerUsuario()
  {
    this.apiGithub.traerPorNombre(this.nombreUsuario);
    // this.nombreUsuario = "";
  }
}
