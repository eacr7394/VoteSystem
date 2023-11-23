import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MeetingCreateComponent } from './meeting-create.component';

const routes: Routes = [
  {
    path: '',
    component: MeetingCreateComponent,
    data: {
      title: $localize`MeetingCreate`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingCreateRoutingModule {
}
