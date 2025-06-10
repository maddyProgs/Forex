import { Routes } from '@angular/router';
import { Signalgrid } from './signalgrid/signalgrid';
import { Signaldetail } from './signaldetail/signaldetail';

export const routes: Routes = [
  { path: 'signals', component: Signalgrid },
  { path: 'signal-detail/:id', component: Signaldetail },
  { path: '', redirectTo: '/signals', pathMatch: 'full' }
  
];

