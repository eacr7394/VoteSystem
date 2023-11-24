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
    this.meetingsData$ = await this.getUsers();
  }

  title = 'Lista de Asambleas';

  meetingsData$!: Observable<IItem[]>;



  private async getUsers(): Promise<Observable<IItem[]>> {
    return (await this.meetingService.getAllMeetingsAsync()).pipe(
      map((itemArray: []) => {
        let meetings: IItem[] = [];
        itemArray.forEach((item: any) => {
          let meeting: IItem = {
            Identificador: item.id, 'Fecha de Celebración': item.date, 'Identificador del Administrador': item.adminId
          };
          meetings.push(meeting);
        });
        return meetings;
      })
    );
  }

}
