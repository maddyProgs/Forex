import { bootstrapApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TradingWidgetComponent } from './app/widget/trading-widget';

// Bootstrap function for widget
async function bootstrapWidget() {
  try {
    const app = await bootstrapApplication(TradingWidgetComponent, {
      providers: [
        importProvidersFrom(HttpClientModule)
      ]
    });

    // Create custom element
    const TradingWidgetElement = createCustomElement(TradingWidgetComponent, {
      injector: app.injector
    });

    // Define custom element
    if (!customElements.get('trading-widget')) {
      customElements.define('trading-widget', TradingWidgetElement);
    }

    console.log('Trading widget loaded successfully');
  } catch (error) {
    console.error('Error bootstrapping widget:', error);
  }
}

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapWidget);
  } else {
    bootstrapWidget();
  }
}

export { bootstrapWidget };