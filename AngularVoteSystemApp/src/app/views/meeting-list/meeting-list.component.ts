import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IItem } from '../../../lib/smart-table/smart-table.type';
import { MeetingListService } from './meeting-list.service';

@Component({
  templateUrl: 'meeting-list.component.html',
  styleUrls: ['meeting-list.component.scss'],
  providers: [MeetingListService],
})
export class MeetingListComponent implements OnInit {
  title = 'Lista de Asambleas';
  meetingsData$!: Observable<IItem[]>;

  constructor(private meetingListService: MeetingListService) { }

  async ngOnInit(): Promise<void> {
    this.meetingsData$ = await this.getUsers();
  }

  private async getUsers(): Promise<Observable<IItem[]>> {
    return (await this.meetingListService.getAllMeetingsAsync()).pipe(
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
