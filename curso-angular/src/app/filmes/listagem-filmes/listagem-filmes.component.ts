import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime} from 'rxjs/operators';
import { ConfigParams } from './../../shared/models/config-params';
import { FilmesService } from './../../core/filmes.service';
import { Filme } from 'src/app/shared/models/filme';
import { Router } from '@angular/router';

@Component({
  selector: 'dio-listagem-filmes',
  templateUrl: './listagem-filmes.component.html',
  styleUrls: ['./listagem-filmes.component.scss']
})
export class ListagemFilmesComponent implements OnInit {

  readonly semfoto = './assets/images/semfoto.gif'

  config: ConfigParams = {
    pagina: 0,
    limite: 4
  };

  filmes: Filme[] = [];
  filtrosListagem: FormGroup;
  generos: Array<string>;
  constructor(private filmesService: FilmesService, private fb: FormBuilder, private router: Router) { }

  
  ngOnInit(): void {
    this.filtrosListagem = this.fb.group(
      {texto:[''],
       genero: ['']
      });

    this.filtrosListagem.get('texto').valueChanges
    .pipe(debounceTime(400))
    .subscribe(( val:string) => {
      this.config.pesquisa= val;
      this.resetarConsulta();
    });

    this.filtrosListagem.get('genero').valueChanges.subscribe(( val:string) => {
      this.config.campo = {tipo: 'genero', valor: val};
      this.resetarConsulta();
    });
    this.generos = ['Ação', 'Drama', 'Romance', 'Terror', 'Ficção científica', 'Comédia', 'Aventura'];

    this.listarFilmes();
  }


  onScroll(): void{
    this.listarFilmes();
  }

  abrir(id:number): void {
    this.router.navigateByUrl('/filmes/'+ id);
  }

  private listarFilmes(){
    this.config.pagina++;
    this.filmesService.listar(this.config)
    .subscribe((filmes:Filme[]) => this.filmes.push(...filmes));
  }
  
  private resetarConsulta(): void{
    this.config.pagina = 0;
    this.filmes = [];
    this.listarFilmes()
  }
}
