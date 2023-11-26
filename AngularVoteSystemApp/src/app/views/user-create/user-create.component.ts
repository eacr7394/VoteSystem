import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';

import { UserService } from '../../services/user.service';
import { UnitService } from '../../services/unit.service';
import { cilSpeak } from '@coreui/icons';


@Component({
  templateUrl: 'user-create.component.html',
  styleUrls: ['user-create.component.scss'],
  providers: [UserService, UnitService]
})
export class UserCreateComponent {

  constructor(private fb: FormBuilder, private userService: UserService, private unitService: UnitService, private cdr: ChangeDetectorRef) {

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(250)]],
      name: ['', [Validators.required, Validators.maxLength(45)]],
      lastname: ['', [Validators.required, Validators.maxLength(45)]],
      unitsSelect: ['', [Validators.required]]
    });

  }

  async ngOnInit(): Promise<void> {

    this.optionsUnit = (await this.unitService.getAllUnitsPromiseAnyArrayAsync()).map((option: any) => ({
      value: option.id,
      label: "Casa #" + option.number,
    }));

    await this.optionsUnit$.next([...this.optionsUnit]);

    await this.searchValueUnit$.subscribe((next) => {
      const filtered = this.optionsUnit.filter((option: any) =>
        option.label.toLowerCase().endsWith(next.trimEnd().toLowerCase()),
      );
      this.optionsUnit$.next([...filtered]);
    });

    await this.cdr.detectChanges();

    this.loading = false;

  }

  icons = { cilSpeak };

  form: FormGroup;

  title = 'Crear Propietario';

  protected email: string = "";

  protected name: string = "";

  protected lastname: string = "";

  protected unitId: string = "";

  protected errorMessage: string = "";

  protected error: boolean = false;

  protected loadingMessage: string = "Por favor, espere...";

  protected loading: boolean = true;

  optionsUnit: any;

  readonly optionsUnit$ = new BehaviorSubject<any[]>([]);

  readonly searchValueUnit$ = new Subject<string>();

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

    this.loading = true;

    if (!this.validateForm()) {

      this.loading = false;

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

        this.loading = false;

        this.clearForm();

        console.log('Usuario creado exitosamente', response);

      },
      (response: any) => {

        this.loading = false;

        if (response.error != null && response.error.error != null) {
          this.errorMessage = response.error.error;
        }

        this.error = true;

        console.error('Error al crear el usuario', response);

      }
    );
  }


}
