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

import { MeetingListRoutingModule } from './meeting-list-routing.module';
import { MeetingListComponent } from './meeting-list.component';

@NgModule({
  imports: [
    MeetingListRoutingModule,
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
  declarations: [MeetingListComponent]
})
export class MeetingListModule {
}
