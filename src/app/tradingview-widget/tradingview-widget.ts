import { Component, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-tradingview-widget',
  standalone: true,  // Add this line to make it a standalone component
  template: `
    <div class="tradingview-widget-container">
      <div class="tradingview-widget-container__widget"></div>
      <div class="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span class="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  `,
  styleUrls: ['./tradingview-widget.css']
})
export class TradingviewWidgetComponent implements AfterViewInit {
  @Input() symbol: string = 'FX:EURUSD';
  @Input() width: number = 350;
  @Input() height: number = 220;

  ngAfterViewInit() {
    this.loadScript();
  }

  private loadScript() {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.async = true;
    script.type = 'text/javascript';
    script.innerHTML = JSON.stringify({
      "symbol": this.symbol,
      "width": this.width,
      "height": this.height,
      "locale": "en",
      "dateRange": "12M",
      "colorTheme": "light",
      "isTransparent": false,
      "autosize": false,
      "largeChartUrl": ""
    });
    document.querySelector('.tradingview-widget-container__widget')?.appendChild(script);
  }
}