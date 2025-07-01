import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignalGridComponent } from '../signalgrid/signalgrid';

@Component({
  selector: 'signal-widget',
  standalone: true,
  imports: [CommonModule, SignalGridComponent],
  template: `
    <app-signal-grid [clientId]="clientId"></app-signal-grid>
  `,
  encapsulation: ViewEncapsulation.ShadowDom
})
export class SignalWidgetComponent {
  @Input() clientId: string = '';
}