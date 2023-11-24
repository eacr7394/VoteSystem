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

import { AssistantListRoutingModule } from './assistant-list-routing.module';
import { AssistantListComponent } from './assistant-list.component';

@NgModule({
  imports: [
    AssistantListRoutingModule,
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
  declarations: [AssistantListComponent]
})
export class AssistantListModule {
}
