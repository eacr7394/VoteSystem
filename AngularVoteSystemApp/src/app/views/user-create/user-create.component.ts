import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from '../../services/user.service';
import { UnitService } from '../../services/unit.service';

@Component({
  templateUrl: 'user-create.component.html',
  styleUrls: ['user-create.component.scss'],
  providers: [UserService, UnitService]
})
export class UserCreateComponent {

  constructor(private fb: FormBuilder, private userService: UserService,
    private unitService: UnitService,
    private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(250)]],
      name: ['', [Validators.required, Validators.maxLength(45)]],
      lastname: ['', [Validators.required, Validators.maxLength(45)]],
      unitsSelect: ['', [Validators.required, Validators.min(1), Validators.max(426)]]
    });
  }

  async ngOnInit(): Promise<void> {
    this.allOptions = await this.unitService.getAllUnitsPromiseAnyArrayAsync();
    this.onSearch('');
    if (this.allOptions.length > 0) {
      this.unitId = this.allOptions[0].id;
    }
    this.cdr.detectChanges();
  }

  form: FormGroup;

  title = 'Crear Propietario';

  protected email: string = "";

  protected name: string = "";

  protected lastname: string = "";

  protected unitId: string = "";

  protected errorMessage: string = "";

  protected error: boolean = false;

  private allOptions: any[] = [];

  options = this.allOptions;

  onSearch(term: string) {
    this.options = this.allOptions.filter(option =>
      option.number.toLowerCase().includes(term.toLowerCase())
    );
  }

  clearForm(): void {
    this.errorMessage = "";
    this.email = "";
    this.name = "";
    this.lastname = "";
    this.unitId = "";
    this.error = false;
  }

  private validateForm(): boolean {

    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    return this.form.valid;
  }

  async createUser(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }
    let user = {
      id: "",
      unitId: this.unitId.toLowerCase(),
      name: this.name.toUpperCase(),
      lastname: this.lastname.toUpperCase(),
      email: this.email.toLowerCase()
    };

    (await this.userService.createUserAsync(user)).subscribe(
      (response: any) => {
        this.clearForm();
        console.log('Usuario creado exitosamente', response);
      },
      (response: any) => {
        if (response.error != null && response.error.error != null) {
          this.errorMessage = response.error.error;
        }
        this.error = true;
        console.error('Error al crear el usuario', response);
      }
    );
  }


}
