import { Component } from '@angular/core';
import { IItem } from '@coreui/angular-pro';
import { Observable } from 'rxjs';
                                                                  
import { UserHasVotingService } from '../../services/user-has-voting.service';

@Component({
  templateUrl: 'user-has-voting-list.component.html',
  styleUrls: ['user-has-voting-list.component.scss'],
  providers: [UserHasVotingService],
})
export class UserHasVotingListComponent {
  constructor(private userHasVotingService: UserHasVotingService) { }

  async ngOnInit(): Promise<void> {
    this.userHasvotingsData$ = await this.userHasVotingService.getAllUserHasVotingsPromiseObservableIItemArray();
  }

  title = 'Votos';

  userHasvotingsData$!: Observable<IItem[]>;

}
