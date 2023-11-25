import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserHasVotingCreateComponent } from './user-has-voting-create.component';

const routes: Routes = [
  {
    path: '',
    component: UserHasVotingCreateComponent,
    data: {
      title: $localize`UserHasVotingCreate`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserHasVotingCreateRoutingModule {
}
