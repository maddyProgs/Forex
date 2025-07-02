import { Component, Input, OnInit, ViewEncapsulation, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignalGridComponent } from '../signalgrid/signalgrid';
import { Signaldetail } from '../signaldetail/signaldetail';
import { TradingSignal } from '../TradingSignal';

@Component({
  selector: 'trading-widget',
  standalone: true,
  imports: [CommonModule, SignalGridComponent, Signaldetail],
  template: `
    <div class="trading-widget-container" [style.width]="width" [style.height]="height">
      <div class="widget-header" *ngIf="showHeader">
        <h3>{{ title }}</h3>
        <div class="widget-controls">
          <button 
            class="view-toggle" 
            [class.active]="currentView === 'grid'"
            (click)="setView('grid')">
            Grid View
          </button>
          <button 
            class="view-toggle" 
            [class.active]="currentView === 'detail'"
            (click)="setView('detail')"
            [disabled]="!selectedSignal">
            Detail View
          </button>
        </div>
      </div>
      
      <div class="widget-content">
        <app-signal-grid 
          *ngIf="currentView === 'grid'"
          [clientId]="clientId"
          (viewDetail)="onViewDetail($event)">
        </app-signal-grid>
        
        <app-signaldetail 
          *ngIf="currentView === 'detail' && selectedSignal"
          [signal]="selectedSignal"
          [clientId]="selectedSignalId"
          (goBack)="onGoBack()">
        </app-signaldetail>
      </div>
      
      <div class="widget-footer" *ngIf="showFooter">
        <span class="powered-by">Powered by Trading Signals</span>
      </div>
    </div>
  `,
  styles: [`
    .trading-widget-container {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .widget-header {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      color: white;
      padding: 12px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .widget-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
    
    .widget-controls {
      display: flex;
      gap: 8px;
    }
    
    .view-toggle {
      padding: 4px 12px;
      border: 1px solid rgba(255,255,255,0.3);
      background: transparent;
      color: white;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .view-toggle:hover {
      background: rgba(255,255,255,0.1);
    }
    
    .view-toggle.active {
      background: rgba(255,255,255,0.2);
      border-color: rgba(255,255,255,0.5);
    }
    
    .view-toggle:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .widget-content {
      padding: 16px;
      overflow-y: auto;
      max-height: calc(100% - 120px);
    }
    
    .widget-footer {
      background: #f8f9fa;
      padding: 8px 16px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    
    .powered-by {
      font-size: 11px;
      color: #6b7280;
    }
  `],
  encapsulation: ViewEncapsulation.ShadowDom,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TradingWidgetComponent implements OnInit {
  @Input() clientId: string = '';
  @Input() width: string = '100%';
  @Input() height: string = '600px';
  @Input() title: string = 'Trading Signals';
  @Input() showHeader: boolean = true;
  @Input() showFooter: boolean = true;
  @Input() defaultView: 'grid' | 'detail' = 'grid';

  currentView: 'grid' | 'detail' = 'grid';
  selectedSignal: TradingSignal | null = null;
  selectedSignalId: string = '';

  ngOnInit() {
    this.currentView = this.defaultView;
  }

  setView(view: 'grid' | 'detail') {
    this.currentView = view;
  }

  onViewDetail(signalId: string) {
    this.selectedSignalId = signalId;
    this.currentView = 'detail';
  }

  onGoBack() {
    this.currentView = 'grid';
    this.selectedSignal = null;
    this.selectedSignalId = '';
  }
}