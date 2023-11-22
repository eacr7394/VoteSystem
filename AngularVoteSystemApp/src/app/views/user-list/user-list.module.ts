import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@coreui/angular';
import { SmartTableModule } from '../../../lib/smart-table/smart-table.module';

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
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ChartjsModule } from '@coreui/angular-chartjs';

import {UserListRoutingModule } from './user-list-routing.module';
import { UserListComponent } from './user-list.component';

import { WidgetsModule } from '../widgets/widgets.module';

@NgModule({
  imports: [
    UserListRoutingModule,
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
    ChartjsModule,
    AvatarModule,
    TableModule,
    WidgetsModule,
    SmartTableModule,
    SharedModule
  ],
  declarations: [UserListComponent]
})
export class UserListModule {
}
