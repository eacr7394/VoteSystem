import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IItem } from '@coreui/angular-pro';
import { MeetingService } from '../../services/meeting.service';

@Component({
  templateUrl: 'meeting-list.component.html',
  styleUrls: ['meeting-list.component.scss'],
  providers: [MeetingService],
})
export class MeetingListComponent {

  constructor(private meetingService: MeetingService) { }

  async ngOnInit(): Promise<void> {
    this.meetingsData$ = await this.meetingService.getAllMeetingsPromiseObservableIItemArrayAsync();
  }

  title = 'Lista de Asambleas';

  meetingsData$!: Observable<IItem[]>;
              

}
