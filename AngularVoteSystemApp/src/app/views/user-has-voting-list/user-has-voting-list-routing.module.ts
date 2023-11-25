import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserHasVotingListComponent } from './user-has-voting-list.component';

const routes: Routes = [
  {
    path: '',
    component: UserHasVotingListComponent,
    data: {
      title: $localize`UserHasVotingList`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserHasVotingListRoutingModule {
}
