import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { TradingWidgetComponent } from './trading-widget';

// Widget loader function
export async function loadTradingWidget() {
  try {
    // Create Angular application with necessary providers
    const app = await createApplication({
      providers: [
        importProvidersFrom(HttpClientModule)
      ]
    });

    // Create custom element
    const TradingWidgetElement = createCustomElement(TradingWidgetComponent, {
      injector: app.injector
    });

    // Define custom element if not already defined
    if (!customElements.get('trading-widget')) {
      customElements.define('trading-widget', TradingWidgetElement);
    }

    return TradingWidgetElement;
  } catch (error) {
    console.error('Error loading trading widget:', error);
    throw error;
  }
}

// Auto-load when script is included
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTradingWidget);
  } else {
    loadTradingWidget();
  }
}