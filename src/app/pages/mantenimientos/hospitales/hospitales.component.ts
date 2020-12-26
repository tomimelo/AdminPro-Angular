import { Component, OnInit, OnDestroy } from '@angular/core';
import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { HospitalService } from '../../../services/hospital.service';
import { Hospital } from '../../../models/hospital.model';

import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedaService } from 'src/app/services/busqueda.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css']
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];
  public totalHospitales: number = 0;
  public imgSubs: Subscription; 
  public desde: number = 0;
  public cargando: boolean = true;

  constructor(private hospitalService: HospitalService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedaService) { }
  
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {

    this.cargarHospitales();
    this.imgSubs = this.modalImagenService.imagenCambio.pipe(delay(100)).subscribe(img => this.cargarHospitales() );

  }
  
  cargarHospitales() {

    this.cargando = true;
  
    this.hospitalService.cargarHospitales(this.desde)
      .subscribe(({total, hospitales}) => {
        this.cargando = false;
        this.totalHospitales = total;
        this.hospitalesTemp = hospitales;      
        this.hospitales = hospitales; 
      });

  }

  cambiarPagina(valor: number) {
    this.desde += valor

    if(this.desde < 0) {
      this.desde = 0;
      return;
    } else if (this.desde >= this.totalHospitales) {
      this.desde -= valor;
      return;
    }

      this.cargarHospitales();

  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
      .subscribe(resp => {
        Swal.fire("Actualizado", hospital.nombre, "success");
      });
  }

  borrarHospital(hospital: Hospital) {
    this.hospitalService.borrarHospital(hospital._id)
      .subscribe(resp => {
        this.cargarHospitales();
        Swal.fire("Eliminado", hospital.nombre, "success");
      });
  }

  async nuevoHospitalModal() {
    const { value } = await Swal.fire<string>({
      title: "Crear nuevo hospital",
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    })

    
    if (value) {
      this.hospitalService.crearHospital(value)
        .subscribe((resp: any) => {
          this.hospitales.push(resp.hospital);
        });
    }
  }

  abrirModal(hospital: Hospital){
    this.modalImagenService.abrirModal("hospitales", hospital._id, hospital.img);
  }

  buscar(termino: string) {

    if ( termino.length === 0 ) {
      return this.hospitales = this.hospitalesTemp;
    }

    this.busquedaService.buscar("hospitales", termino)
      .subscribe(resultados => {
        this.hospitales = resultados;
      });

  }

}
