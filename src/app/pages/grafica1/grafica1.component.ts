import { Component } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styleUrls: ['./grafica1.component.css']
})
export class Grafica1Component {

  public labels1: string[] = ['Cocina', 'Limpieza', 'Alimentos'];
  public data1 = [
    [100, 50, 200]
  ];

  constructor() { }

}
