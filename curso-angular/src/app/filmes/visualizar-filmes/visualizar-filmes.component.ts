import { FilmesService } from './../../core/filmes.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Filme } from 'src/app/shared/models/filme';
import { MatDialog } from '@angular/material';
import { Alerta } from 'src/app/shared/models/alerta';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';

@Component({
  selector: 'dio-visualizar-filmes',
  templateUrl: './visualizar-filmes.component.html',
  styleUrls: ['./visualizar-filmes.component.scss']
})
export class VisualizarFilmesComponent implements OnInit {
  readonly semfoto = './assets/images/semfoto.gif';
  filme: Filme;
  id: number;
  constructor(public dialog: MatDialog, private activateRoute: ActivatedRoute,
     private filmesService: FilmesService, private router : Router) { }

  ngOnInit() {
    this.id = this.activateRoute.snapshot.params['id'];
    this.visualizar();
  }

  private visualizar(){
    this.filmesService.visualizar(this.id).subscribe((filme: Filme) => this.filme= filme);
  }

  private editar(){
    this.router.navigateByUrl('/filmes/cadastro/' + this.id)
  }

  private excluir(): void{
    const config = {
      data:{
        titulo: 'Você tem certeza que deseja excluir?',
        descricao: 'Caso você tenha certeza, clique no botão OK',
        corBtnCancelar: 'primary',
        corBtnSucesso: 'warn',
        possuiBtnFechar: true
      }as Alerta
    }
    
    const dialogRef = this.dialog.open(AlertaComponent,config)
    dialogRef.afterClosed().subscribe((opcao: boolean)=> {
      if(opcao){
         this.filmesService.excluir(this.id)
         .subscribe(() => this.router.navigateByUrl('/filmes'));
      }
    })
  }

}
