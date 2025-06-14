import { Routes } from '@angular/router';
import { Signalgrid } from './signalgrid/signalgrid';
import { Signaldetail } from './signaldetail/signaldetail';

export const routes: Routes = [
  { path: 'signalgrid', component: Signalgrid },
  { path: 'signal-detail/:id', component: Signaldetail },
  { path: '', redirectTo: '/signalgrid', pathMatch: 'full' }
  
];

