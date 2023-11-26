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

    this.assistantsData$ = await this.assistantService.getAllAssistantsPromiseObservableIItemArrayAsync();

    this.loading = false;

  }

  title = 'Lista de Quorums';

  protected loadingMessage: string = "Por favor, espere...";

  protected loading: boolean = true;

  assistantsData$!: Observable<IItem[]>;
 
}
