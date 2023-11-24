import { Component, OnInit } from '@angular/core';
import { IItem } from '@coreui/angular-pro';
import { map, Observable } from 'rxjs';
import { VotingListService } from './voting-list.service';

@Component({
  templateUrl: 'voting-list.component.html',
  styleUrls: ['voting-list.component.scss'],
  providers: [VotingListService],
})
export class VotingListComponent implements OnInit {
  title = 'Lista de Quorums';
  votingsData$!: Observable<IItem[]>;

  constructor(private votingListService: VotingListService) { }

  async ngOnInit(): Promise<void> {
    this.votingsData$ = await this.getVotings();
  }

  private async getVotings(): Promise<Observable<IItem[]>> {
    return (await this.votingListService.getVotingsAsync()).pipe(
      map((itemArray: []) => {
        let votings: IItem[] = [];
        itemArray.forEach((item: any) => {
          let voting: IItem = {
            '# de Casa': item.unitNumber, 'Fecha de Asamblea': item.meetingDate,
            Vota: 'yes' === item.canVote ? "Sí" : "No"
          };
          console.log(item);
          votings.push(voting);
        });
        return votings;
      })
    );
  }
}
