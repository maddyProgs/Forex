import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../service/httpservice';
import { TradingSignal } from '../TradingSignal';

@Component({
  selector: 'app-signaldetail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signaldetail.html',
  styleUrls: ['./signaldetail.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class Signaldetail implements OnInit {
  @Input() signal: TradingSignal | null = null;
  @Input() clientId: string = '';
  @Output() goBack = new EventEmitter<void>();

  signal$: Observable<TradingSignal | null> = of(null);
  loadingError: string | null = null;
  currentTime: string = new Date().toLocaleTimeString();
  rawData: any;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    if (this.signal) {
      this.signal$ = of(this.signal);
      this.rawData = this.signal;
    } else if (this.clientId) {
      this.signal$ = this.apiService.get<any>(`get-signal/${this.clientId}`).pipe(
        map(data => {
          if (typeof data === 'string') {
            data = JSON.parse(data);
          }
          const normalized: TradingSignal = {
            ...data,
            type: data.Type || data.type || '',
            Entry: data.Entry || data.entry || '',
            Target1: data.Target1 || data.target1 || '',
            Target2: data.Target2 || data.target2 || '',
            StopLoss: data.StopLoss || data.stopLoss || '',
            symbol: data.symbol || '',
            duration: data.duration || '',
            chart_url: data.chart_url || '',
            trend: data.trend || '',
            support1: data.support1 || '',
            resistance1: data.resistance1 || '',
            support2: data.support2 || '',
            resistance2: data.resistance2 || '',
            support3: data.support3 || '',
            resistance3: data.resistance3 || ''
          };
          this.rawData = normalized;
          return normalized;
        }),
        catchError(err => {
          console.error('Failed to load signal:', err);
          this.loadingError = 'Failed to load signal data';
          return of(null);
        })
      );
    } else {
      this.loadingError = 'No signal or client ID provided';
    }

    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        timeZone: 'UTC'
      });
    }, 1000);
  }

  onGoBack() {
    this.goBack.emit();
  }
}