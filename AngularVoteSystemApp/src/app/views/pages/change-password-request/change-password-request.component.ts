import { Component } from '@angular/core';
import { IndexedDbService } from '../../../indexed-db.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-change-password-request',
  templateUrl: './change-password-request.component.html',
  styleUrls: ['./change-password-request.component.scss'],
  providers: [AuthService]
})
export class ChangePasswordRequestComponent {
  constructor(private authService: AuthService, private db: IndexedDbService, private router: Router,
    private route: ActivatedRoute) {
  }

  async ngOnInit(): Promise<void> {

    await this.route.queryParams.subscribe(async (params: Params) => {

      this.requestId = params['requestId'];

      this.uniqueKey = params['uniqueKey'];

      this.adminId = params['adminId'];

      if (this.requestId && this.adminId && this.uniqueKey) {

        await this.db.set(this.db.AnonymousVotingQueryParamsKey, {
          requestId: this.requestId,
          adminId: this.adminId,
          uniqueKey: this.uniqueKey,
        });

        const newUrl = this.router.url.split('?')[0];

        await this.router.navigateByUrl(newUrl);

      }
      else {

        let queryParams = (await this.db.get(this.db.ChangePasswordQueryParamsKey)).value;

        console.log(queryParams);

        this.requestId = queryParams.requestId;

        this.adminId = queryParams.adminId;

        this.uniqueKey = queryParams.uniqueKey;
      }
    });

    this.loading = false;

  }

  protected newPassword: string = "";

  protected newPasswordRepeat: string = "";

  requestId: string = "";

  uniqueKey: string = "";

  adminId: string = "";

  protected error: boolean = false;

  protected errorMessage: string = "";

  protected loadingMessage: string = "Por favor, espere...";

  protected loading: boolean = true;

  clearForm(): void {

    this.errorMessage = "";

    this.newPassword = "";

    this.newPasswordRepeat = "";

    this.error = false;

  }

  async changePassword(): Promise<void> {

    this.loading = true;

    if (this.newPassword == "" || this.newPasswordRepeat == "") {

      this.errorMessage = "Todos los campos son requeridos.";

      this.loading = false;

      return;

    }

    if (this.newPassword !== this.newPasswordRepeat) {

      this.errorMessage = "Las contraseñas no coinciden.";

      this.loading = false;

      return;

    }

    (await this.authService.sendChangePassword(this.requestId, this.uniqueKey, this.adminId, this.newPassword)).subscribe(
      (response: any) => {

        this.loading = false;

        this.clearForm();                                

        console.log('Cambio de contraseña exitoso.', response);

      },
      (response: any) => {
        this.loading = false;

        if (response.error != null && response.error.error != null) {
          this.errorMessage = response.error.error;
        }

        this.error = true;

        console.error('Error al cambiar la contraseña', response);

      }
    );

  }

}
