import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AssistantListComponent } from './assistant-list.component';

const routes: Routes = [
  {
    path: '',
    component: AssistantListComponent,
    data: {
      title: $localize`AssistantList`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssistantListRoutingModule {
}
