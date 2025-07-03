import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { createCustomElement } from '@angular/elements';
import { App } from './app/app';
import { Signalgrid } from './app/signalgrid/signalgrid';


bootstrapApplication(Signalgrid)
  .then(appRef => {
    const widgetElement = createCustomElement(Signalgrid, {
      injector: appRef.injector,
    });
    customElements.define('signal-widget', widgetElement);
  })
  .catch(err => console.error(err));