import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TradingSignal } from '../TradingSignal';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../service/httpservice';
@Component({
  selector: 'app-signaldetail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signaldetail.html',
  styleUrl: './signaldetail.css'
})
export class Signaldetail {
  private route = inject(ActivatedRoute);
  private apiService = inject(ApiService);
  
  signal$: Observable<TradingSignal>;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    this.signal$ = this.apiService.get<TradingSignal>(`get-signal/${id}`);
  }

}
