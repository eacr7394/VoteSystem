import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import {
  AvatarModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  MultiSelectModule,
  NavModule,
  ProgressModule,
  TableModule,
  TabsModule
} from '@coreui/angular-pro';
import { IconModule } from '@coreui/icons-angular';

import { UserHasVotingCreateRoutingModule } from './user-has-voting-create-routing.module';
import { UserHasVotingCreateComponent } from './user-has-voting-create.component';

@NgModule({
  imports: [
    UserHasVotingCreateRoutingModule,
    CardModule,
    NavModule,
    IconModule,
    TabsModule,
    CommonModule,
    GridModule,
    ProgressModule,
    ReactiveFormsModule,
    ButtonModule,
    FormModule,
    ButtonModule,
    ButtonGroupModule,
    AvatarModule,
    TableModule,
    FormsModule,
    MultiSelectModule
  ],
  declarations: [UserHasVotingCreateComponent]
})
export class UserHasVotingCreateModule {
}
