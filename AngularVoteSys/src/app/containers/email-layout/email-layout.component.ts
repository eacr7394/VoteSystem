import { Component, HostBinding } from '@angular/core';

import { navItems } from './_nav';

@Component({
  selector: 'app-email',
  templateUrl: './email-layout.component.html',
  styleUrls: ['./email-layout.component.scss']
})
export class EmailLayoutComponent {
  @HostBinding('class.c-app') cAppClass = true;

  public navItems = navItems;

  constructor() {}
}
