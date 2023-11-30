import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cilSpeak } from '@coreui/icons';   
import { BehaviorSubject, Subject } from 'rxjs';

import { AssistantService } from '../../services/assistant.service';
import { MeetingService } from '../../services/meeting.service';
import { UnitService } from '../../services/unit.service';

@Component({
  templateUrl: 'assistant-create.component.html',
  styleUrls: ['assistant-create.component.scss'],
  providers: [AssistantService, MeetingService, UnitService],
})
export class AssistantCreateComponent {
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private assistantService: AssistantService,
    private meetingService: MeetingService, private unitService: UnitService) {

    this.form = this.fb.group({
      unitsSelect: ['', [Validators.required]],
      canVoteSelect: ['', [Validators.required]],
      meetingsSelect: ['', [Validators.required]],
      powerEmail: ['', []],
      power: ['', []],
    });

  }

  async ngOnInit(): Promise<void> {

    this.optionsCanVote = await this.optionsCanVoteDataArray.map((option: any) => ({
      value: option.id,
      label: option.value,
    }));

    await this.optionsCanVote$.next([...this.optionsCanVote]);

    await this.searchValueCanVote$.subscribe((next) => {
      const filtered = this.optionsCanVote.filter((option: any) =>
        option.label.toLowerCase().startsWith(next.trimStart().toLowerCase()),
      );
      this.optionsCanVote$.next([...filtered]);
    });

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

    await this.cdr.detectChanges();

    this.loading = false;

  }

  optionsCanVote: any;

  optionsCanVoteDataArray: any[] = [{ id: "yes", value: "Sí, puede votar." }, { id: "no", value: "No, no puede votar." }];

  readonly optionsCanVote$ = new BehaviorSubject<any[]>([]);

  readonly searchValueCanVote$ = new Subject<string>();

  optionsUnit: any;
  
  readonly optionsUnit$ = new BehaviorSubject<any[]>([]);

  readonly searchValueUnit$ = new Subject<string>();

  optionsMeeting: any;

  readonly optionsMeeting$ = new BehaviorSubject<any[]>([]);

  readonly searchValueMeeting$ = new Subject<string>();

  icons = { cilSpeak };

  title = 'Quorum';

  form: FormGroup;

  protected canVote: string = "";

  protected unitId: string = "";

  protected meetingId: string = "";

  protected errorMessage: string = "";

  protected power: string = "";

  protected powerEmail: string = "";

  protected error: boolean = false;    

  protected loadingMessage: string = "Por favor, espere...";

  protected loading: boolean = true;

  clearForm(): void {

    this.errorMessage = "";

    this.canVote = "";

    this.unitId = "";

    this.meetingId = "";

    this.power = "";

    this.powerEmail = "";

    this.error = false;

  }

  private validateForm(): boolean {

    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    return this.form.valid;
  }

  async createAssistant(): Promise<void> {

    this.loading = true;

    if (!this.validateForm() || this.unitId === "" || this.meetingId === "" || this.canVote === "") {

      this.loading = false;

      return;

    }

    let user = {
      id: "",
      unitId: this.unitId.toLowerCase(),
      canVote: this.canVote.toLowerCase(),
      meetingId: this.meetingId.toLowerCase(),
      assistantRepresent: this.power.toUpperCase(),
      emailRepresent: this.powerEmail.toLowerCase()
    };

    (await this.assistantService.createAssistantAsync(user)).subscribe(
      (response: any) => {

        this.loading = false;

        this.clearForm();

        console.log('Asistencia creada exitosamente', response);

      },
      (response: any) => {

        this.loading = false;

        if (response.error != null && response.error.error != null) {

          this.errorMessage = response.error.error;

        }

        this.error = true;

        console.error('Error al crear la assistencia', response);
      }
    );

  }            

}
