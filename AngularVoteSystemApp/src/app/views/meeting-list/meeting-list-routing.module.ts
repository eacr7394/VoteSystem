import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MeetingListComponent } from './meeting-list.component';

const routes: Routes = [
  {
    path: '',
    component: MeetingListComponent,
    data: {
      title: $localize`MeetingList`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingListRoutingModule {
}
