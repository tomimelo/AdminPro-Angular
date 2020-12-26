import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';

import { Usuario } from '../../../models/usuario.model';

import { BusquedaService } from '../../../services/busqueda.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSubs: Subscription; 
  public desde: number = 0;
  public cargando: boolean = true;

  constructor( private usuarioService: UsuarioService,
               private busquedaService: BusquedaService,
               private modalImagenService: ModalImagenService ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.imgSubs = this.modalImagenService.imagenCambio.pipe(delay(100)).subscribe(img => this.cargarUsuarios() );
    
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
      .subscribe(({total, usuarios}) => {
        this.totalUsuarios = total;
        this.usuarios = usuarios;
        this.usuariosTemp = usuarios;
        this.cargando = false;
      });
  }

  cambiarPagina(valor: number) {
    this.desde += valor

    if(this.desde < 0) {
      this.desde = 0;
      return;
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
      return;
    }

      this.cargarUsuarios();

  }

  buscar(termino: string) {

    if ( termino.length === 0 ) {
      return this.usuarios = this.usuariosTemp;
    }
    this.busquedaService.buscar("usuarios", termino)
      .subscribe((resp: Usuario[]) => {
        this.usuarios = resp;
      });
  }

  eliminarUsuario(usuario: Usuario) {

    if(usuario._id === this.usuarioService.uid){
      return Swal.fire("Error", "No puedes borrarte a ti mismo", "error");
    }

    Swal.fire({
      title: 'Seguro quieres eliminar el usuario?',
      text: `El usuario ${usuario.nombre} será eliminado`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar'
    }).then((result) => {
      if (result.value) {

        this.usuarioService.eliminarUsuario(usuario)
          .subscribe(resp => {

            this.cargarUsuarios();

            Swal.fire(
              'Usuario eliminado',
              `${usuario.nombre} ha sido eliminado correctamente`,
              'success'
            );

          });
      }
    });
  }

  cambiarRole(usuario: Usuario) {
    this.usuarioService.guardarUsuario(usuario)
      .subscribe(resp => {
        console.log(resp);
      })
  }

  abrirModal(usuario: Usuario) {
    this.modalImagenService.abrirModal("usuarios", usuario._id, usuario.img);
  }

}
