import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';   
import {
  AvatarModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,            
  DatePickerModule,
  FormModule,
  GridModule,
  NavModule,
  ProgressModule,
  TableModule,
  TabsModule
} from '@coreui/angular-pro';
import { IconModule } from '@coreui/icons-angular';      

import { MeetingCreateRoutingModule } from './meeting-create-routing.module';
import { MeetingCreateComponent } from './meeting-create.component';

@NgModule({
  imports: [
    MeetingCreateRoutingModule,
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
    DatePickerModule,  
  ],
  declarations: [MeetingCreateComponent]
})
export class MeetingCreateModule {
}
