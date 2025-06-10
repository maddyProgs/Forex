// signaldetail.ts
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TradingSignal } from '../TradingSignal';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, catchError, of, tap } from 'rxjs';
import { ApiService } from '../service/httpservice';

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
  
  signal$: Observable<TradingSignal | null>;
  loadingError: string | null = null;
  currentTime: string;
  rawData: any; // For debugging

  constructor() {
    this.signal$ = of(null);
    this.currentTime = new Date().toLocaleTimeString();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loadingError = 'No signal ID provided';
      return;
    }

    this.signal$ = this.apiService.get<any>(`get-signal/${id}`).pipe(
      tap(data => {
        // If data is a string, parse it
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        data.type = data.Type || data.type;
        data.Entry = data.Entry || data.entry;
        data.Target1 = data.Target1 || data.target1;
        data.Target2 = data.Target2 || data.target2;
        data.StopLoss = data.StopLoss || data.stopLoss;
        // ...map other fields as needed

        this.rawData = data;
      }),
      catchError(error => {
        console.error('Error loading signal:', error);
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