import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public usuario: Usuario;

  menuItems: any[];

  constructor(public sidebarService: SidebarService,
              private usuarioService: UsuarioService) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
  }

}
