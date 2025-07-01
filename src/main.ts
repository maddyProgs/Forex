import { bootstrapApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { SignalWidgetComponent } from './app/widget/signal-widget';
import { appConfig } from './app/app.config';

const injector = (appConfig.providers as any).injector;
const SignalWidget = createCustomElement(SignalWidgetComponent, { injector });

customElements.define('signal-widget', SignalWidget);