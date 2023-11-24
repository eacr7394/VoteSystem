import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssistantService } from '../../services/assistant.service';
import { MeetingService } from '../../services/meeting.service';
import { UnitService } from '../../services/unit.service';

@Component({
  templateUrl: 'assistant-create.component.html',
  styleUrls: ['assistant-create.component.scss'],
  providers: [AssistantService, MeetingService, UnitService],
})
export class AssistantCreateComponent {
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef,
    private assistantService: AssistantService,     
    private meetingService: MeetingService,
    private unitService: UnitService) {
    this.form = this.fb.group({
      unitsSelect: ['', [Validators.required]],
      canVoteSelect: ['', [Validators.required]],
      meetingsSelect: ['', [Validators.required]],
    });
  }

  async ngOnInit(): Promise<void> {

    this.allOptionsMeetings = await this.getMeetings();

    this.onSearchMeeting('');

    if (this.allOptionsMeetings.length > 0) {

      this.meetingId = this.allOptionsMeetings[0].id;

    }

    this.allOptionsUnits = await this.unitService.getAllUnitsPromiseAnyArrayAsync();

    this.onSearchUnit('');

    if (this.allOptionsUnits.length > 0) {

      this.unitId = this.allOptionsUnits[0].id;

    }

    this.cdr.detectChanges();

  }

  title = 'Quorum';

  form: FormGroup;

  protected canVote: string = "";

  protected unitId: string = "";

  protected meetingId: string = "";

  protected errorMessage: string = "";

  protected error: boolean = false;

  private allOptionsUnits: any[] = [];

  optionsUnits = this.allOptionsUnits;

  optionsCanVotes: any[] = [{ id: "yes", value: "Sí" }, { id: "no", value: "No" }];

  private allOptionsMeetings: any[] = [];

  optionsMeetings = this.allOptionsMeetings;

  onSearchCanVote(term: string) {
    this.optionsCanVotes = this.optionsCanVotes.filter(option =>
      option.value.toLowerCase().includes(term.toLowerCase())
    );
  }

  onSearchUnit(term: string) {
    this.optionsUnits = this.allOptionsUnits.filter(option =>
      option.number.toLowerCase().includes(term.toLowerCase())
    );
  }

  onSearchMeeting(term: string) {
    this.optionsMeetings = this.allOptionsMeetings.filter(option =>
      option.value.toLowerCase().includes(term.toLowerCase())
    );
  }

  clearForm(): void {
    this.errorMessage = "";
    this.canVote = "";
    this.unitId = "";
    this.meetingId = "";
    this.error = false;
  }

  private validateForm(): boolean {

    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    return this.form.valid;
  }

  async createAssistant(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }
    let user = {
      id: "",
      unitId: this.unitId.toLowerCase(),
      canVote: this.canVote.toLowerCase(),
      meetingId: this.meetingId.toLowerCase(),
    };

    (await this.assistantService.createAssistantAsync(user)).subscribe(
      (response: any) => {
        this.clearForm();
        console.log('Asistencia creada exitosamente', response);
      },
      (response: any) => {
        if (response.error != null && response.error.error != null) {
          this.errorMessage = response.error.error;
        }
        this.error = true;
        console.error('Error al crear la assistencia', response);
      }
    );
  }            

  async getMeetings(): Promise<any[]> {

    const meetings: any[] = [];

    (await this.meetingService.getAllMeetingsAsync()).forEach((item: []) => {
      item.forEach((item: any) => {
        let obj = { id: item.id, value: String(item.date) };
        meetings.push(obj);
      });
    });

    return meetings;
  }

}
