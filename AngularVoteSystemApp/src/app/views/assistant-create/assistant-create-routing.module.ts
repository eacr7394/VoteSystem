import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AssistantCreateComponent } from './assistant-create.component';

const routes: Routes = [
  {
    path: '',
    component: AssistantCreateComponent,
    data: {
      title: $localize`AssistantCreate`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssistantCreateRoutingModule {
}
