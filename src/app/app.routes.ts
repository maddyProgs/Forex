import { Routes } from '@angular/router';
import { SignalGridComponent } from './signalgrid/signalgrid';
import { Signaldetail } from './signaldetail/signaldetail';

export const routes: Routes = [
  { path: 'signalgrid', component: SignalGridComponent },
  { path: 'signal-detail/:id', component: Signaldetail },
  { path: '', redirectTo: '/signalgrid', pathMatch: 'full' }
];