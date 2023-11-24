import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { IItem } from '@coreui/angular-pro';
import { AssistantService } from '../../services/assistant.service'; 

@Component({
  templateUrl: 'assistant-list.component.html',
  styleUrls: ['assistant-list.component.scss'],
  providers: [AssistantService],
})
export class AssistantListComponent {

  constructor(private assistantService: AssistantService) { }

  async ngOnInit(): Promise<void> {
    this.assistantsData$ = await this.assistantService
      .getAllAssistantsPromiseObservableIItemArrayAsync();
  }

  title = 'Lista de Quorums';

  assistantsData$!: Observable<IItem[]>;
 
}
