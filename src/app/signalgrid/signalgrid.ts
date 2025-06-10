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
    this.loadTradingViewScript();
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
      signals.forEach(signal => {
        const widgetId = this.getWidgetId(signal);
        const container = document.getElementById(widgetId);

        if (container) {
          container.innerHTML = ''; // Clear previous widget if any

          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
          script.async = true;
          script.innerHTML = `
          {
            "autosize": true,
            "symbol": "${this.mapToTradingViewSymbol(signal.symbol || "EURUSD")}",
            "interval": "4H",
            "timezone": "Etc/UTC",
            "theme": "light",
            "style": "1",
            "locale": "en",
            "allow_symbol_change": false,
            "hide_top_toolbar": true,
            "hide_legend": true,
            "hide_side_toolbar": true,
            "withdateranges": false,
            "support_host": "https://www.tradingview.com"
          }`;
          container.appendChild(script);
        }
      });
    });
  }
  getWidgetId(signal: TradingSignal): string {
    return `tradingview-widget-${signal._id || signal.symbol}`;
  }

  private mapToTradingViewSymbol(symbol: string): string {
    const symbolMap: { [key: string]: string } = {
      EURUSD: 'FX:EURUSD',
      GBPUSD: 'FX:GBPUSD',
      AUDUSD: 'FX:AUDUSD',
      NZDUSD: 'FX:NZDUSD',
      USDCHF: 'FX:USDCHF',
      USDJPY: 'FX:USDJPY',
      USDCAD: 'FX:USDCAD',
      XAUUSD: 'OANDA:XAUUSD',
      XAGUSD: 'OANDA:XAGUSD',
      WTI_OIL: 'TVC:USOIL',
      DJ30: 'TVC:DJI',
      UK100: 'TVC:UKX'
    };
    return symbolMap[symbol] || symbol;
  }
}
