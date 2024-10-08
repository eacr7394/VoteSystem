import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { LoginComponent } from './views/pages/login/login.component';

import { ChangePasswordComponent } from './views/pages/change-password/change-password.component';
import { ChangePasswordRequestComponent } from './views/pages/change-password-request/change-password-request.component';

import { AnonymousVotingComponent } from './views/pages/anonymous-voting/anonymous-voting.component';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';

import { UserListComponent } from './views/user-list/user-list.component';
import { UserCreateComponent } from './views/user-create/user-create.component';

import { MeetingListComponent } from './views/meeting-list/meeting-list.component';
import { MeetingCreateComponent } from './views/meeting-create/meeting-create.component';

import { AssistantListComponent } from './views/assistant-list/assistant-list.component';
import { AssistantCreateComponent } from './views/assistant-create/assistant-create.component';

import { VotingListComponent } from './views/voting-list/voting-list.component';
import { VotingCreateComponent } from './views/voting-create/voting-create.component';

import { UserHasVotingListComponent } from './views/user-has-voting-list/user-has-voting-list.component';
import { UserHasVotingCreateComponent } from './views/user-has-voting-create/user-has-voting-create.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'user-list',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        canActivate: [AuthGuard, RoleGuard],
        path: 'user-list',
        loadChildren: () =>
          import('./views/user-list/user-list.module').then((m) => m.UserListModule)
      },
      {
        canActivate: [AuthGuard, RoleGuard],
        path: 'user-create',
        loadChildren: () =>
          import('./views/user-create/user-create.module').then((m) => m.UserCreateModule)
      },
      {
        canActivate: [AuthGuard, RoleGuard],
        path: 'meeting-list',
        loadChildren: () =>
          import('./views/meeting-list/meeting-list.module').then((m) => m.MeetingListModule)
      },
      {
        canActivate: [AuthGuard, RoleGuard],
        path: 'meeting-create',
        loadChildren: () =>
          import('./views/meeting-create/meeting-create.module').then((m) => m.MeetingCreateModule)
      },
      {
        canActivate: [AuthGuard, RoleGuard],
        path: 'assistant-list',
        loadChildren: () =>
          import('./views/assistant-list/assistant-list.module').then((m) => m.AssistantListModule)
      },
      {
        canActivate: [AuthGuard, RoleGuard],
        path: 'assistant-create',
        loadChildren: () =>
          import('./views/assistant-create/assistant-create.module').then((m) => m.AssistantCreateModule)
      },
      {
        canActivate: [AuthGuard, RoleGuard],
        path: 'voting-list',
        loadChildren: () =>
          import('./views/voting-list/voting-list.module').then((m) => m.VotingListModule)
      },
      {
        canActivate: [AuthGuard, RoleGuard],
        path: 'voting-create',
        loadChildren: () =>
          import('./views/voting-create/voting-create.module').then((m) => m.VotingCreateModule)
      },
      {
        canActivate: [AuthGuard, RoleGuard],
        path: 'user-has-voting-list',
        loadChildren: () =>
          import('./views/user-has-voting-list/user-has-voting-list.module').then((m) => m.UserHasVotingListModule)
      },
      {
        canActivate: [AuthGuard, RoleGuard],
        path: 'user-has-voting-create',
        loadChildren: () =>
          import('./views/user-has-voting-create/user-has-voting-create.module').then((m) => m.UserHasVotingCreateModule)
      },
      {
        canActivate: [AuthGuard, RoleGuard],
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/pages.module').then((m) => m.PagesModule)
      },
    ]
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    data: {
      title: 'Change Password Page'
    }
  },
  {
    path: 'change-password-request',
    component: ChangePasswordRequestComponent,
    data: {
      title: 'Change Password Request Page'
    }
  },
  {
    canActivate: [AuthGuard, RoleGuard],
    path: 'user-list',
    component: UserListComponent,
    data: {
      title: 'User List Page'
    }
  },
  {
    canActivate: [AuthGuard, RoleGuard],
    path: 'user-create',
    component: UserCreateComponent,
    data: {
      title: 'User Create Page'
    }
  },
  {
    canActivate: [AuthGuard, RoleGuard],
    path: 'meeting-list',
    component: MeetingListComponent,
    data: {
      title: 'Meeting List Page'
    }
  },
  {
    canActivate: [AuthGuard, RoleGuard],
    path: 'meeting-create',
    component: MeetingCreateComponent,
    data: {
      title: 'Meeting Create Page'
    }
  },
  {
    canActivate: [AuthGuard, RoleGuard],
    path: 'assistant-list',
    component: AssistantListComponent,
    data: {
      title: 'Assitant List Page'
    }
  },
  {
    canActivate: [AuthGuard, RoleGuard],
    path: 'assistant-create',
    component: AssistantCreateComponent,
    data: {
      title: 'Assitant Create Page'
    }
  },
  {
    canActivate: [AuthGuard, RoleGuard],
    path: 'voting-list',
    component: VotingListComponent,
    data: {
      title: 'Voting List Page'
    }
  },
  {
    canActivate: [AuthGuard, RoleGuard],
    path: 'voting-create',
    component: VotingCreateComponent,
    data: {
      title: 'Voting Create Page'
    }
  },
  {
    canActivate: [AuthGuard, RoleGuard],
    path: 'user-has-voting-list',
    component: UserHasVotingListComponent,
    data: {
      title: 'User has Voting List Page'
    }
  },
  {
    canActivate: [AuthGuard, RoleGuard],
    path: 'user-has-voting-create',
    component: UserHasVotingCreateComponent,
    data: {
      title: 'User has Voting Create Page'
    }
  },
  {
    path: 'anonymous-voting',
    component: AnonymousVotingComponent,
    data: {
      title: 'Anonymous Voting Page'
    }
  },
  { path: '**', redirectTo: 'user-list' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking'
      // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
