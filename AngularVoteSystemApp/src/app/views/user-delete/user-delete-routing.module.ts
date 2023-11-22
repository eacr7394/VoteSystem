import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserDeleteComponent } from './user-delete.component';

const routes: Routes = [
  {
    path: '',
    component: UserDeleteComponent,
    data: {
      title: $localize`UserDelete`
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserDeleteRoutingModule {
}
