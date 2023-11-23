import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first

import { BadgeModule, CardModule } from '@coreui/angular-pro';

import { FullCalendarNgComponent } from './full-calendar-ng.component';
// Routing
import { FullCalendarNgRoutingModule } from './full-calendar-ng-routing.module';

import { DocsComponentsModule } from '@docs-components/docs-components.module';

@NgModule({
  declarations: [FullCalendarNgComponent],
  imports: [
    CommonModule,
    FullCalendarNgRoutingModule,
    FullCalendarModule,
    CardModule,
    BadgeModule,
    DocsComponentsModule,
  ],
})
export class FullCalendarNgModule {}
