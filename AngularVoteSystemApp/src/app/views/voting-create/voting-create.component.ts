import { Component } from '@angular/core';
import { VotingCreateService } from './voting-create.service';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MeetingListService } from '../meeting-list/meeting-list.service';    


@Component({
  templateUrl: 'voting-create.component.html',
  styleUrls: ['voting-create.component.scss']
})
export class VotingCreateComponent {

  form: FormGroup;

  title = 'Creación de temas de votación';

  protected meetingId: string = "";        

  protected errorMessage: string = "";

  protected error: boolean = false;

  private allOptionsMeetings: any[] = [];

  optionsMeetings = this.allOptionsMeetings;
     

  onSearchMeeting(term: string) {
    this.optionsMeetings = this.allOptionsMeetings.filter(option =>
      option.value.toLowerCase().includes(term.toLowerCase())
    );
  }

  async ngOnInit(): Promise<void> {

    this.allOptionsMeetings = await this.getMeetings();
    this.onSearchMeeting('');
    if (this.allOptionsMeetings.length > 0) {
      this.meetingId = this.allOptionsMeetings[0].id;
    }
    this.cdr.detectChanges();
  }


  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef,
    private votingCreateService: VotingCreateService,  
    private meetingListService: MeetingListService) {
    this.form = this.fb.group({        
      meetingsSelect: ['', [Validators.required]],
    });
  }

  clearForm(): void {
    this.errorMessage = "";
    this.meetingId = "";
    this.error = false;
  }

  private validateForm(): boolean {

    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });

    return this.form.valid;
  }

  async createVoting(): Promise<void> {
    if (!this.validateForm()) {
      return;
    }
    let voting = {
      id: "",                   
      meetingId: this.meetingId.toLowerCase(),
    };

    (await this.votingCreateService.createVotingAsync(voting)).subscribe(
      (response: any) => {
        this.clearForm();
        console.log('Tema de votación creado exitosamente', response);
      },
      (response: any) => {
        if (response.error != null && response.error.error != null) {
          this.errorMessage = response.error.error;
        }
        this.error = true;
        console.error('Error al crear el tema de votación', response);
      }
    );
  }

  async getMeetings(): Promise<any[]> {

    const meetings: any[] = [];

    (await this.meetingListService.getAllMeetingsAsync()).forEach((item: []) => {
      item.forEach((item: any) => {
        let obj = { id: item.id, value: String(item.date) };
        meetings.push(obj);
      });
    });

    return meetings;
  }
}
