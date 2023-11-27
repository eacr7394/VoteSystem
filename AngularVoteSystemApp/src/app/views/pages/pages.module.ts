import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PagesRoutingModule } from './pages-routing.module';
import { LoginComponent } from './login/login.component';                                    
import { AnonymousVotingComponent } from './anonymous-voting/anonymous-voting.component';    
import { Page404Component } from './page404/page404.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangePasswordRequestComponent } from './change-password-request/change-password-request.component';
import { Page500Component } from './page500/page500.component';
import { AvatarModule, ButtonGroupModule, ButtonModule, CardModule, FormModule, GridModule, MultiSelectModule, NavModule, ProgressModule, TableModule, TabsModule } from '@coreui/angular-pro';
import { IconModule } from '@coreui/icons-angular';

import { SharedModule, SmartTableModule } from '@coreui/angular-pro';

@NgModule({
  declarations: [
    ChangePasswordRequestComponent,
    ChangePasswordComponent,
    AnonymousVotingComponent,
    LoginComponent,
    Page404Component,
    Page500Component
  ],
  imports: [
    SharedModule, SmartTableModule,
    TabsModule,
    NavModule,
    FormsModule,
    CommonModule,
    PagesRoutingModule,
    CardModule,
    ButtonModule,
    GridModule,
    IconModule,
    FormModule,               
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
  ]
})
export class PagesModule {
}
