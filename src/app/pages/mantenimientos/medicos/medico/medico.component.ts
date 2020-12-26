import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';

import { CargarHospital } from 'src/app/interfaces/cargar-hospitales.interface';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';

import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styleUrls: ['./medico.component.css']
})
export class MedicoComponent implements OnInit {

  public medicoForm: FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado: Hospital;
  public medicoSeleccionado: Medico;

  constructor(private fb: FormBuilder,
              private hospitalService: HospitalService,
              private medicoService: MedicoService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.params.subscribe(({id}) => {
      this.cargarMedico(id);
    });

    this.medicoForm = this.fb.group({
      nombre: new FormControl("", Validators.required),
      hospital: new FormControl("", Validators.required)
    });

    this.cargarHospitales();
    this.medicoForm.get("hospital").valueChanges.subscribe(hospitalId => {
      this.hospitalSeleccionado = this.hospitales.find(hospital => hospital._id === hospitalId);
    });

  }

  guardarMedico() {
    if(this.medicoForm.invalid) {
      return;
    }

    if(this.medicoSeleccionado) {
      const medico = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico(medico)
        .subscribe((resp: any) => {
          console.log(resp);
          Swal.fire('Medico actualizado', `${resp.medico.nombre} actualizado correctamente`, 'success');
        });
    } else {
      this.medicoService.crearMedico(this.medicoForm.value)
        .subscribe((resp: any) => {
          Swal.fire('Medico creado', `${resp.medico.nombre} creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/medicos/${resp.medico._id}`);
        });
    }

  }

  cargarMedico(id) {

    if (id === 'nuevo') {
      return;
    }

    this.medicoService.getMedico(id).pipe(delay(100)).subscribe(medico => {

      if(!medico) {
        return this.router.navigateByUrl(`/dashboard/medicos`);
      }

      const {nombre, hospital} = medico;
      this.medicoSeleccionado = medico;
      this.medicoForm.setValue({nombre, hospital});
    });
  }

  cargarHospitales() {
    this.hospitalService.cargarHospitales().subscribe((resp: CargarHospital) => {
      this.hospitales = resp.hospitales;
    });
  }

}
