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
import { ChartjsModule } from '@coreui/angular-chartjs';

import { UserCreateRoutingModule } from './user-create-routing.module';
import { UserCreateComponent } from './user-create.component';

@NgModule({
  imports: [
    UserCreateRoutingModule,
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
    FormsModule,
    MultiSelectModule
  ],
  declarations: [UserCreateComponent]
})
export class UserCreateModule {
}
