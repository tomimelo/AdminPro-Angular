import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Medico } from 'src/app/models/medico.model';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css']
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[] = [];
  private medicosTemp: Medico[] = [];
  public cargando: boolean = true;
  private imgSubs: Subscription;

  constructor(private medicoService: MedicoService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedaService) { }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.imagenCambio.pipe(delay(100)).subscribe(img => this.cargarMedicos() );
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();    
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe( medicos => {
        this.cargando = false,
        this.medicos = medicos;
        this.medicosTemp = medicos;
      });
  }

  abrirModal(medico: Medico){
    this.modalImagenService.abrirModal("medicos", medico._id, medico.img);
  }

  borrarMedico(medico: Medico) {

    Swal.fire({
      title: 'Seguro quieres eliminar el Medico?',
      text: `El Medico ${medico.nombre} será eliminado`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar'
    }).then((result) => {
      if (result.value) {

        this.medicoService.borrarMedico(medico._id)
          .subscribe(resp => {

            this.cargarMedicos();

            Swal.fire(
              'Medico eliminado',
              `${medico.nombre} ha sido eliminado correctamente`,
              'success'
            );

          });
      }
    });
  }

  buscar(termino: string) {

    if ( termino.length === 0 ) {
      return this.medicos = this.medicosTemp;
    }

    this.busquedaService.buscar("medicos", termino)
      .subscribe((resultados: Medico[]) => {
        this.medicos = resultados;
      });

  }

}
