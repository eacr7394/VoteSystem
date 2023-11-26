import { Component } from '@angular/core';
import { IndexedDbService } from '../../../indexed-db.service';
import {  Router } from '@angular/router';   

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [AuthService]
})
export class ChangePasswordComponent {
  constructor(private authService: AuthService, private db: IndexedDbService, private router: Router) {
  }

  async ngOnInit(): Promise<void> {

    this.loading = false;

  }

  protected email: string = "";        

  protected error: boolean = false;

  protected errorMessage: string = "";

  protected loadingMessage: string = "Por favor, espere...";

  protected loading: boolean = true;

  clearForm(): void {

    this.errorMessage = "Todos los campos son requeridos";

    this.email = "";

    this.error = false;

  }

  async changePassword(): Promise<void> {

    this.loading = true;

    if (this.email == "") {

      this.loading = false;

      return;

    }

    (await this.authService.sendChangePasswordRequest(this.email)).subscribe(
      (response: any) => {

        this.loading = false;

        this.clearForm();   

        console.log('Correo de cambio de contraseña enviado', response);

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
