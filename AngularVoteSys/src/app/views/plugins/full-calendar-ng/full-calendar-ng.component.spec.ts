import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first

import { FullCalendarNgComponent } from './full-calendar-ng.component';
import { CardModule } from '@coreui/angular-pro';
import { DocsComponentsModule } from '../../../../components';

describe('FullCalendarNgComponent', () => {
  let component: FullCalendarNgComponent;
  let fixture: ComponentFixture<FullCalendarNgComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FullCalendarNgComponent ],
      imports: [FullCalendarModule, CardModule, DocsComponentsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullCalendarNgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
