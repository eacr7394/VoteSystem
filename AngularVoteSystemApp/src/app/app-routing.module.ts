import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { LoginComponent } from './views/pages/login/login.component';
import { AuthGuard } from './auth.guard';
import { RoleGuard } from './role.guard';

import { UserListComponent } from './views/user-list/user-list.component';
import { UserCreateComponent } from './views/user-create/user-create.component';
import { UserDeleteComponent } from './views/user-delete/user-delete.component';

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
        path: 'user-delete',
        loadChildren: () =>
          import('./views/user-delete/user-delete.module').then((m) => m.UserDeleteModule)
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
    canActivate: [AuthGuard, RoleGuard],
    path: 'user-list',
    component: UserListComponent,
    data: {
      title: 'User List Page'
    }
  },
  { path: '**', redirectTo: 'user-list'}
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
