import { Component } from '@angular/core';
import { UserCreateService } from './user-create.service';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  templateUrl: 'user-create.component.html',
  styleUrls: ['user-create.component.scss']
})
export class UserCreateComponent {

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


  async ngOnInit(): Promise<void> {
    this.allOptions = await this.getUnits();
    this.onSearch('');
    if (this.allOptions.length > 0) {
      this.unitId = this.allOptions[0].id;
    }
    this.cdr.detectChanges();
  }


  constructor(private fb: FormBuilder, private userCreateService: UserCreateService, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(250)]],
      name: ['', [Validators.required, Validators.maxLength(45)]],
      lastname: ['', [Validators.required, Validators.maxLength(45)]],
      unitsSelect: ['', [Validators.required, Validators.min(1), Validators.max(426)]]
    });
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

    (await this.userCreateService.createUser(user)).subscribe(
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

  async getUnits(): Promise<any[]> {

    const units: any[] = [];

    (await this.userCreateService.getUnits()).forEach((item: []) => {
      item.forEach((item: any) => {
        let obj = { id: item.id, number: String(item.number) };
        units.push(obj);
      });
    });

    return units;
  }
}
