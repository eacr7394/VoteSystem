import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VotingCreateComponent } from './voting-create.component';

const routes: Routes = [
  {
    path: '',
    component: VotingCreateComponent,
    data: {
      title: $localize`VotingCreate`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VotingCreateRoutingModule {
}
