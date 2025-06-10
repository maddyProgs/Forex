import { Component, inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../service/httpservice';
import { CommonModule } from '@angular/common';
import { faInfoCircle, faClock, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { map, Observable } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';
import { TradingSignal } from '../TradingSignal';
import { Signaldetail } from '../signaldetail/signaldetail';

interface MongoId {
  $oid: string;
}

@Component({
  selector: 'app-signalgrid',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './signalgrid.html',
  styleUrl: './signalgrid.css'
})
export class Signalgrid implements AfterViewInit { 
  private apiService = inject(ApiService);
  private router = inject(Router);
  
  signals$: Observable<TradingSignal[]>;
  
  // Font Awesome icons
  faInfoCircle = faInfoCircle;
  faClock = faClock;
  faArrowLeft = faArrowLeft;

  activeSignal: TradingSignal | null = null;

  constructor() {
    this.signals$ = this.apiService.get<{ signals: string }>('get-signals')
      .pipe(
        map(response => {
          try {
            const parsedSignals = JSON.parse(response.signals) as TradingSignal[];
            // Ensure _id is properly formatted
            return parsedSignals.map(signal => ({
              ...signal,
              _id: this.normalizeId(signal._id)
            }));
          } catch (e) {
            console.error('Error parsing signals:', e);
            return [];
          }
        })
      );
  }

  private normalizeId(id: string | MongoId | undefined): string {
    if (!id) return '';
    if (typeof id === 'string') return id;
    return id.$oid; // Now TypeScript knows this is a MongoId object
  }

  parseEntryPrice(strategy: string): string {
    const match = strategy.match(/price ([\d.]+) range/);
    return match ? match[1] : 'N/A';
  }

  parseTargets(strategy: string): string {
    const matches = strategy.match(/targets at ([\d.]+) and ([\d.]+)/);
    return matches ? `${matches[1]} / ${matches[2]}` : 'N/A';
  }

  parseStopLoss(strategy: string): string {
    const match = strategy.match(/stop-loss at ([\d.]+)/);
    return match ? match[1] : 'N/A';
  }
  
  navigateToSignalDetail(signal: TradingSignal) {
    const signalId = signal._id || signal.symbol;
    this.router.navigate(['/signal-detail', signalId]);
  }

  ngAfterViewInit() {
    this.loadTradingViewWidgets();
  }
  loadTradingViewWidgets() {
    throw new Error('Method not implemented.');
  }
  private loadTradingViewScript() {
    if (!document.querySelector('script[src*="tradingview.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
      script.async = true;
      script.type = 'text/javascript';
      script.onload = () => this.initWidgets();
      document.head.appendChild(script);
    } else {
      // Script already loaded, initialize widgets
      this.initWidgets();
    }
  }

  private initWidgets() {
  this.signals$.subscribe(signals => {
    // Wait for both the script and DOM to be ready
    const checkReady = () => {
      if (typeof (window as any).TradingView !== 'undefined') {
        signals.forEach(signal => {
          const widgetId = this.getWidgetId(signal);
          const container = document.getElementById(widgetId);
          
          if (container && !container.hasChildNodes()) {
            new (window as any).TradingView.widget({
              // ... widget config ...
            });
          }
        });
      } else {
        setTimeout(checkReady, 100);
      }
    };
    checkReady();
  });
}
  getWidgetId(signal: TradingSignal): string {
    return `tradingview-widget-${signal._id || signal.symbol}`;
  }
}
