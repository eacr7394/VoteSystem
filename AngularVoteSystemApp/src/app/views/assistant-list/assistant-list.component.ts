import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IItem } from '@coreui/angular-pro';
import { AssistantListService } from './assistant-list.service';

@Component({
  templateUrl: 'assistant-list.component.html',
  styleUrls: ['assistant-list.component.scss'],
  providers: [AssistantListService],
})
export class AssistantListComponent implements OnInit {
  title = 'Lista de Quorums';
  assistantsData$!: Observable<IItem[]>;

  constructor(private assistantListService: AssistantListService) { }

  async ngOnInit(): Promise<void> {
    this.assistantsData$ = await this.getAssistants();
  }

  private async getAssistants(): Promise<Observable<IItem[]>> {
    return (await this.assistantListService.getAssistantsAsync()).pipe(
      map((itemArray: []) => {
        let assistants: IItem[] = [];
        itemArray.forEach((item: any) => {
          let assistant: IItem = {
            '# de Casa': item.unitNumber, 'Fecha de Asamblea': item.meetingDate,
            Vota: 'yes' === item.canVote ? "Sí" : "No"
          };
          console.log(item);
          assistants.push(assistant);
        });
        return assistants;
      })
    );
  }
}
