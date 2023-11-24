import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IndexedDbService } from '../../indexed-db.service';

import { MeetingService } from '../../services/meeting.service';

@Component({
  templateUrl: 'meeting-create.component.html',
  styleUrls: ['meeting-create.component.scss'],
  providers: [MeetingService]
})
export class MeetingCreateComponent {
  constructor(private db: IndexedDbService, private fb: FormBuilder,
    private meetingService: MeetingService, private cdr: ChangeDetectorRef) {
    this.form = this.fb.group({
      dateCreated: []
    });
  }

  title = 'Crear Reunión';

  form: FormGroup;

  date: Date = new Date();

  errorMessage: string = "";

  error: boolean = false;

  minDate: Date = this.date;



  clearForm(): void {
    this.errorMessage = "";
    this.date = this.minDate;
    this.error = false;
  }

  private validateForm(): boolean {
    if (this.date < this.minDate) {
      this.errorMessage = "Usted ha ingresado '" + this.date.toLocaleDateString() + "', la fecha de la Asamblea no puede ser inferior a "+this.minDate.toLocaleDateString();
      this.error = true;
      return false;
    }
    Object.values(this.form.controls).forEach(control => control.markAsTouched());
    return this.form.valid;
  }

  private getUtcDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  async createMeeting(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }
    this.errorMessage = "";
    this.error = false;


    let meeting = {
      id: "",
      adminId: (await this.db.get(this.db.UserIdKey)).value,
      date: this.getUtcDate(this.date)
    };

    (await this.meetingService.createMeetingAsync(meeting)).subscribe(
      (response: any) => {
        this.clearForm();
        console.log('Asamblea creada exitosamente', response);
      },
      (response: any) => {
        if (response.error != null && response.error.error != null) {
          this.errorMessage = response.error.error;
        }
        this.error = true;
        console.error('Error al crear la asamblea', response);
      }
    );
  }

}
