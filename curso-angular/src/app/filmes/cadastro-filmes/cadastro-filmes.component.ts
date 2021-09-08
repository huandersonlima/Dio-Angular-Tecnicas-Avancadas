import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { FilmesService } from './../../core/filmes.service';
import { ValidarCamposService } from './../../shared/components/campos/validar-campos.service';
import { Filme } from 'src/app/shared/models/filme';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';
import { Alerta } from 'src/app/shared/models/alerta';

@Component({
  selector: 'dio-cadastro-filmes',
  templateUrl: './cadastro-filmes.component.html',
  styleUrls: ['./cadastro-filmes.component.scss']
})
export class CadastroFilmesComponent implements OnInit {

  cadastro: FormGroup;
  generos: Array<string>;
  id:number;
 
  
  constructor(public validacao: ValidarCamposService, public dialog: MatDialog,
              private fb: FormBuilder, private filmeService: FilmesService, private router : Router,
              private activatedRoute: ActivatedRoute) { }
  get f(){
    //console.log(this.cadastro.controls)
    return this.cadastro.controls;
  }

  ngOnInit(): void {

    this.id = this.activatedRoute.snapshot.params['id'];
    if(this.id){
      this.filmeService.visualizar(this.id).subscribe((filme:Filme) => this.criarFormulario(filme));

    }else{
      this.criarFormulario(this.CriarFilmeEmBranco());
    }
    

    this.generos = ['Ação', 'Drama', 'Romance', 'Terror', 'Ficção científica', 'Comédia', 'Aventura'];

  }


  submit(): void{
    this.cadastro.markAllAsTouched();
    if(this.cadastro.invalid){
      return ;
    }
    const filme = this.cadastro.getRawValue() as Filme;
    if(this.id){
      filme.id = this.id;
      this.editar(filme)
    }else{
      this.salvar(filme);
    }
   
  }

  reiniciarForm(): void{
    this.cadastro.reset();
  }

  private CriarFilmeEmBranco(): Filme{
    return {
      titulo: null,
      dtLancamento: null,
      urlFoto: null,
      descricao:null,
      nota: null,
      urlIMDb: null,
      genero: null
    }as Filme;
  }

  private criarFormulario (filme:Filme): void{
    this.cadastro = this.fb.group({
      titulo: [filme.titulo, [Validators.required, Validators.minLength(2), Validators.maxLength(256)]],
      urlFoto: [filme.urlFoto, [Validators.minLength(10)]],
      dtLancamento: [filme.dtLancamento, [Validators.required]],
      descricao: [filme.descricao],
      nota: [filme.nota, [Validators.required, Validators.min(0), Validators.max(10)]],
      urlIMDb: [filme.urlIMDb, [Validators.minLength(10)]],
      genero: [filme.genero, [Validators.required]]

    });
  }

  private salvar (filme: Filme):void{
    this.filmeService.salvar(filme).subscribe(() => {
      const config = {
        data:{
          btnSucesso: 'Ir para a Listagem',
          btnCancelar: 'cadastrar novo Filme',
          corBtnCancelar:'primary',
          possuiBtnFechar: true
        }as Alerta
      }
      const dialogRef = this.dialog.open(AlertaComponent,config)
      dialogRef.afterClosed().subscribe((opcao: boolean)=> {
        if(opcao){
           this.router.navigateByUrl('filmes');
        }else{
          this.reiniciarForm();
        }
      })
    },
    () => {
       const config = {
        data:{
          titulo: 'Erro ao salvar o registro',
          descricao: 'Não foi possivel salvar o registro, tente novamente mais tarde',
          btnSucesso: 'Fechar',
          corBtnSucesso: 'warn'
        }as Alerta
      }
      this.dialog.open(AlertaComponent, config)
    });
    
  }

  private editar(filme: Filme):void{
    this.filmeService.editar(filme).subscribe(() => {
      const config = {
        data:{
          descricao:'Seu registro foi atualizado com sucesso',
          btnSucesso: 'Ir para a Listagem'
        }as Alerta
      }
      const dialogRef = this.dialog.open(AlertaComponent,config)
      dialogRef.afterClosed().subscribe(()=> this.router.navigateByUrl('filmes'));
    },
    () => {
       const config = {
        data:{
          titulo: 'Erro ao editar o registro',
          descricao: 'Não foi possivel editar o registro, tente novamente mais tarde',
          btnSucesso: 'Fechar',
          corBtnSucesso: 'warn'
        }as Alerta
      }
      this.dialog.open(AlertaComponent, config)
    });
    
  }

}
