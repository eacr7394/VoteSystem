import { Component } from '@angular/core';
import { IndexedDbService } from '../../../indexed-db.service';
import {  Router } from '@angular/router';   

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AuthService]
})
export class LoginComponent {
  constructor(private authService: AuthService, private db: IndexedDbService,
    private router: Router) {
  }

  async ngOnInit(): Promise<void> {

    if (await this.authService.isAuthenticated()) {
      this.router.navigate(['/user-list']);
    }
  }

  protected userName: string = "";

  protected password: string = "";

  protected error: boolean = false;

  protected errorMessage: string = "Verifique sus credenciales";

  clearForm(): void {
    this.errorMessage = "Verifique sus credenciales";
    this.userName = "";
    this.password = "";
    this.error = false;
  }

  async login(): Promise<void> {
    if (this.userName == "" || this.password == "") {
      return;
    }
    (await this.authService.authorize(this.userName, this.password)).subscribe(
      (response: any) => {
        this.clearForm();
        this.db.set(this.db.IsAuthenticatedKey, true);
        this.db.set(this.db.UserIdKey, response.id);
        this.router.navigate(['/user-list']);
        console.log('Inicio de sesión exitoso', response);
      },
      (response: any) => {
        if (response.error != null && response.error.error != null) {
          this.errorMessage = response.error.error;
        }
        this.error = true;
        console.error('Error al iniciar sesión', response);
      }
    );

  }

}
