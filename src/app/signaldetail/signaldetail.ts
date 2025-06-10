// signaldetail.ts
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../service/httpservice';
import { TradingSignal } from '../TradingSignal';

@Component({
  selector: 'app-signaldetail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signaldetail.html',
  styleUrl: './signaldetail.css'
})
export class Signaldetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);

  signal$: Observable<TradingSignal | null> = of(null);
  loadingError: string | null = null;
  currentTime: string = new Date().toLocaleTimeString();
  rawData: any;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loadingError = 'No signal ID provided';
      return;
    }

    this.signal$ = this.apiService.get<any>(`get-signal/${id}`).pipe(
      map(data => {
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }

        // Normalize casing
        const normalized: TradingSignal = {
          ...data,
          type: data.Type || data.type || '',
          Entry: data.Entry || data.entry || '',
          Target1: data.Target1 || data.target1 || '',
          Target2: data.Target2 || data.target2 || '',
          StopLoss: data.StopLoss || data.stopLoss || ''
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

    setInterval(() => {
      this.currentTime = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        timeZone: 'UTC'
      });
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
