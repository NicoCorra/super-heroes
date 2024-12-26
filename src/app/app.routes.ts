import { Routes } from '@angular/router';
import { Error404Component } from './shared/pages/error404/error404.component';
import { HeroesRoutingModule } from './heroes/heroes-routing.module';

export const routes: Routes = [
  {
    path: 'heroes',
    loadChildren: () => HeroesRoutingModule,
  },
  {
    path: '404',
    component: Error404Component
  },
  {
    path: '',
    redirectTo: 'heroes',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '404',
  }
];

