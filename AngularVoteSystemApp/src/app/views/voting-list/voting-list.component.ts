import { Component } from '@angular/core';
import { IItem } from '@coreui/angular-pro';
import { Observable } from 'rxjs';
                                                                  
import { VotingService } from '../../services/voting.service';

@Component({
  templateUrl: 'voting-list.component.html',
  styleUrls: ['voting-list.component.scss'],
  providers: [VotingService],
})
export class VotingListComponent {
  constructor(private votingService: VotingService) { }

  async ngOnInit(): Promise<void> {
    this.votingsData$ = await this.votingService.getAllVotingsPromiseObservableIItemArray();
  }

  title = 'Lista de Quorums';

  votingsData$!: Observable<IItem[]>;

}
