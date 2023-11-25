import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cilSpeak } from '@coreui/icons';
import { BehaviorSubject, Subject } from 'rxjs';

import { MeetingService } from '../../services/meeting.service';
import { VotingService } from '../../services/voting.service';
import { UserHasVotingService } from '../../services/user-has-voting.service';

@Component({
  templateUrl: 'user-has-voting-create.component.html',
  styleUrls: ['user-has-voting-create.component.scss'],
  providers: [MeetingService, VotingService]
})
export class UserHasVotingCreateComponent {

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef,
    private votingService: VotingService,
    private userHasVotingService: UserHasVotingService,
    private meetingService: MeetingService) {
    this.form = this.fb.group({
      meetingsSelect: ['', [Validators.required]],
      descriptionSelect: ['', [Validators.required]],
    });
  }


  async ngOnInit(): Promise<void> {

    this.optionsMeeting = (await this.meetingService.getAllMeetingsPromiseAnyArray()).map((option: any) => ({
      value: option.id,
      label: option.value,
    }));
    this.optionsMeeting$.next([...this.optionsMeeting]);
    this.searchValueMeeting$.subscribe((next) => {
      const filtered = this.optionsMeeting.filter((option: any) =>
        option.label.toLowerCase().startsWith(next.trimStart().toLowerCase()),
      );
      this.optionsMeeting$.next([...filtered]);
    });

    this.optionsDescription = (await this.votingService.getAllVotingsPromiseAnyArray()).map((option: any) => ({
      value: option.id,
      label: option.value,
    }));
    this.optionsDescription$.next([...this.optionsDescription]);
    this.searchValueDescription$.subscribe((next) => {
      const filtered = this.optionsDescription.filter((option: any) =>
        option.label.toLowerCase().startsWith(next.trimStart().toLowerCase()),
      );
      this.optionsDescription$.next([...filtered]);
    });
    this.cdr.detectChanges();
  }

  icons = { cilSpeak };

  form: FormGroup;

  title = 'Creación de temas de votación';

  protected meetingId: string = "";

  protected votingId: string = "";

  protected errorMessage: string = "";

  protected error: boolean = false;

  optionsMeeting: any;
  readonly optionsMeeting$ = new BehaviorSubject<any[]>([]);
  readonly searchValueMeeting$ = new Subject<string>();


  optionsDescription: any;
  readonly optionsDescription$ = new BehaviorSubject<any[]>([]);
  readonly searchValueDescription$ = new Subject<string>();

  clearForm(): void {
    this.errorMessage = "";
    this.meetingId = "";
    this.votingId = "";
    this.error = false;
  }

  private validateForm(): boolean {
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
    return this.form.valid;
  }

  async generateUserHasVoting(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }         

    (await this.userHasVotingService.generateAllUserHasVoteAsync(this.votingId)).subscribe(
      (response: any) => {
        this.clearForm();
        console.log('Votaciones generadas exitosamente', response);
      },
      (response: any) => {
        if (response.error != null && response.error.error != null) {
          this.errorMessage = response.error.error;
        }
        this.error = true;
        console.error('Error al generar las votaciones', response);
      }
    );
  }

}
