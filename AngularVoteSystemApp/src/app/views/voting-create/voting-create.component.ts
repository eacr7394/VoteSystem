import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cilSpeak } from '@coreui/icons';
import { BehaviorSubject, Subject } from 'rxjs';

import { MeetingService } from '../../services/meeting.service';
import { VotingService } from '../../services/voting.service';

@Component({
  templateUrl: 'voting-create.component.html',
  styleUrls: ['voting-create.component.scss'],
  providers: [MeetingService, VotingService]
})
export class VotingCreateComponent implements OnInit {

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private votingService: VotingService, private meetingService: MeetingService) {
    this.form = this.fb.group({
      meetingsSelect: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(250)]],
    });
  }

  async ngOnInit(): Promise<void> {

    this.optionsMeeting = (await this.meetingService.getAllMeetingsPromiseAnyArray()).map((option: any) => ({
      value: option.id,
      label: option.value,
    }));

    await this.optionsMeeting$.next([...this.optionsMeeting]);

    await this.searchValueMeeting$.subscribe((next) => {
      const filtered = this.optionsMeeting.filter((option: any) =>
        option.label.toLowerCase().startsWith(next.trimStart().toLowerCase()),
      );
      this.optionsMeeting$.next([...filtered]);
    });
    
    await this.cdr.detectChanges();

    this.loading = false;

  }

  icons = { cilSpeak };

  form: FormGroup;

  title = 'Creación de temas de votación';

  protected meetingId: string = "";

  protected description: string = "";

  protected errorMessage: string = "";

  protected error: boolean = false;

  optionsMeeting: any;

  readonly optionsMeeting$ = new BehaviorSubject<any[]>([]);

  readonly searchValueMeeting$ = new Subject<string>();

  protected loadingMessage: string = "Por favor, espere...";

  protected loading: boolean = true;

  clearForm(): void {

    this.errorMessage = "";

    this.meetingId = "";

    this.description = "";

    this.error = false;

  }

  private validateForm(): boolean {

    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    return this.form.valid;
  }

  async createVoting(): Promise<void> {

    this.loading = true;

    if (!this.validateForm()) {

      this.loading = false;

      return;

    }

    let voting = {
      id: "",                   
      meetingId: this.meetingId.toLowerCase(),
      description: this.description.toUpperCase(),
    };

    (await this.votingService.createVotingAsync(voting)).subscribe(
      (response: any) => {

        this.loading = false;

        this.clearForm();

        console.log('Tema de votación creado exitosamente', response);

      },
      (response: any) => {

        this.loading = false;

        if (response.error != null && response.error.error != null) {

          this.errorMessage = response.error.error;

        }

        this.error = true;

        console.error('Error al crear el tema de votación', response);
      }
    );

  }

}
