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
  nombreUsuario: string = "";

  traerUsuario()
  {
    this.apiGithub.traerPorNombre(this.nombreUsuario);
    this.nombreUsuario = "";

    setTimeout(() => {
      console.log(this.apiGithub.usuGithub);
      this.cdr.detectChanges(); //esto le avisa a angular que tiene que actualizar el html
    }, 800); //tiempo de espera para que llegue la info y se muestre bien
  }
}
