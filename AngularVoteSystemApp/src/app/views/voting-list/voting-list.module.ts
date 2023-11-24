import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule, SmartTableModule } from '@coreui/angular-pro';          
import {
  AvatarModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  NavModule,
  ProgressModule,
  TableModule,
  TabsModule
} from '@coreui/angular-pro';
import { IconModule } from '@coreui/icons-angular';      

import { VotingListRoutingModule } from './voting-list-routing.module';
import { VotingListComponent } from './voting-list.component';


@NgModule({
  imports: [
    VotingListRoutingModule,
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
    SmartTableModule,
    SharedModule
  ],
  declarations: [VotingListComponent]
})
export class VotingListModule {
}
