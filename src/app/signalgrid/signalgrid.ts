import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  AfterViewInit,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faInfoCircle, faClock, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../service/httpservice';
import { TradingSignal } from '../TradingSignal';
import { Signaldetail } from '../signaldetail/signaldetail';

interface MongoId {
  $oid: string;
}

@Component({
  selector: 'app-signal-grid',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, Signaldetail],
  templateUrl: './signalgrid.html',
  styleUrls: ['./signalgrid.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class SignalGridComponent implements OnInit, AfterViewInit {
  @Input() clientId: string = '';
  @Output() viewDetail = new EventEmitter<string>();

  signals$: Observable<TradingSignal[]> = of([]);
  selectedSignal: TradingSignal | null = null;

  faInfoCircle = faInfoCircle;
  faClock = faClock;
  faArrowLeft = faArrowLeft;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    if (!this.clientId) return;

    this.signals$ = this.apiService.get<{ signals: string }>(`get-signals?client_id=${this.clientId}`).pipe(
      map(response => {
        try {
          const parsedSignals = JSON.parse(response.signals) as TradingSignal[];
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

  ngAfterViewInit(): void {
    this.initWidgets();
  }

  private normalizeId(id: string | MongoId | undefined): string {
    if (!id) return '';
    if (typeof id === 'string') return id;
    return id.$oid;
  }

  getWidgetId(signal: TradingSignal): string {
    return `tradingview-widget-${signal._id || signal.symbol}`;
  }

  private initWidgets() {
    this.signals$.subscribe(signals => {
      signals.forEach(signal => {
        const widgetId = this.getWidgetId(signal);
        const container = document.getElementById(widgetId);

        if (container) {
          container.innerHTML = '';

          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
          script.async = true;
          script.innerHTML = `
          {
            "autosize": true,
            "symbol": "${this.mapToTradingViewSymbol(signal.symbol || 'EURUSD')}",
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

  navigateToSignalDetail(signal: TradingSignal) {
    this.selectedSignal = signal;
    this.viewDetail.emit(this.normalizeId(signal._id) || signal.symbol);
  }

  goBack() {
    this.selectedSignal = null;
  }
}