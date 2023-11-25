import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ClassToggleService, HeaderComponent } from '@coreui/angular-pro';
import { IndexedDbService } from '../../../indexed-db.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  constructor(private classToggler: ClassToggleService,
    private authService: AuthService, private db: IndexedDbService,
    private router: Router) {
    super();
  }

  async logout(): Promise<void> {
    await (await this.authService.logout()).subscribe(
      (response: void) => {
        this.db.set(this.db.IsAuthenticatedKey, false);
        this.db.set(this.db.UserIdKey, "");
        console.log('Cierre de sesión exitoso', response);
        this.router.navigate(['/login']);
      },
      (error: void) => {
        this.db.set(this.db.IsAuthenticatedKey, false);
        this.db.set(this.db.UserIdKey, "");
        console.error('Error al cerrar sesión', error);
        this.router.navigate(['/login']);
      }
    );
    
  }
}
