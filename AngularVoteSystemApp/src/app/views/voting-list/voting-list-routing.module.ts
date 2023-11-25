import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VotingListComponent } from './voting-list.component';

const routes: Routes = [
  {
    path: '',
    component: VotingListComponent,
    data: {
      title: $localize`UserHasVotingList`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VotingListRoutingModule {
}
