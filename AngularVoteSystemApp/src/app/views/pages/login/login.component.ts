import { Component } from '@angular/core';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  protected userName: string = "";
  protected password: string = "";
  protected error: boolean = false;
  protected errorMessage: string = "Verifique sus credenciales";

  constructor(private loginService: LoginService) { }

  clearForm(): void {
    this.errorMessage = "Verifique sus credenciales";
    this.userName = "";
    this.password = "";
    this.error = false;
  }

  login(): void {
    if (this.userName == "" || this.password == "") {
      return;
    }
    this.loginService.login(this.userName, this.password).subscribe(
      (response: any) => {
        this.clearForm();
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

  logout(): void {
    this.loginService.logout().subscribe(
      (response: void) => {
        // Manejar la respuesta exitosa (redirección, limpiar token, etc.)
        console.log('Cierre de sesión exitoso', response);
      },
      (error: void) => {
        // Manejar el error (mostrar mensaje de error, etc.)
        console.error('Error al cerrar sesión', error);
      }
    );
  }

}
