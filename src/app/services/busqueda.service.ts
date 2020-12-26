import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedaService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem("token") || "";
  }

  get headers() {
    return {
      headers: {
        "x-token": this.token
      }
    }
  }

  private transformarHospitales(resultados: any[]): Hospital[] {
    return resultados.map(
      hospital => new Hospital(hospital.nombre, hospital._id, hospital.img, hospital.usuario)
    );
  }

  private transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
      user => new Usuario(user.nombre, user.email, "", user.img, user.google, user.role, user._id)
    );
  }

  private transformarMedicos(resultados: any[]): Medico[] {
    return resultados.map(
      medico => new Medico(medico.nombre, medico._id, medico.img, medico.usuario, medico.hospital)
    );
  }

  busquedaGlobal(termino: string) {
    const url = `${base_url}/todo/${termino}`;
    return this.http.get(url, this.headers);
  }

  buscar(tipo: "usuarios" | "medicos" | "hospitales",
         termino: string) {

    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    return this.http.get<any[]>(url, this.headers)
            .pipe(
              map( (resp: any) => {
                switch (tipo) {

                  case "medicos": 
                    return this.transformarMedicos(resp.resultados);
                  case "usuarios":
                    return this.transformarUsuarios(resp.resultados);
                  case "hospitales": 
                    return this.transformarHospitales(resp.resultados);
                
                  default:
                    break;
                }
              })
            );

  }

}
