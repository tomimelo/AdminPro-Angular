import { Component, OnDestroy } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnDestroy{

  public titulo: string;
  public tituloSubs$: Subscription;

  constructor( private router: Router) {

    this.tituloSubs$ = this.getRouteArgs()
                        .subscribe(({titulo}) => {
                          this.titulo = titulo;
                          document.title = `AdminPro - ${titulo}`;
                        });
                        
  }

  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

  getRouteArgs() {
    return this.router.events
      .pipe(
        filter(event => event instanceof ActivationEnd),
        filter( (event: ActivationEnd) => event.snapshot.firstChild === null),
        map( (event: ActivationEnd) => event.snapshot.data)
      )
  }

}
