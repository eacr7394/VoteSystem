import { Component, OnInit } from '@angular/core';
import { IItem } from '@coreui/angular-pro';
import { Observable } from 'rxjs';
                                                                  
import { VotingService } from '../../services/voting.service';

@Component({
  templateUrl: 'voting-list.component.html',
  styleUrls: ['voting-list.component.scss'],
  providers: [VotingService],
})
export class VotingListComponent implements OnInit {

  constructor(private votingService: VotingService) { }

  async ngOnInit(): Promise<void> {

    this.votingsData$ = await this.votingService.getAllVotingsPromiseObservableIItemArray();

    this.loading = false;

  }

  title = 'Lista de Quorums';

  protected loadingMessage: string = "Por favor, espere...";

  protected loading: boolean = true;

  votingsData$!: Observable<IItem[]>;

}
