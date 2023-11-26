import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { IItem } from '@coreui/angular-pro';
import { Observable } from 'rxjs';
import { IndexedDbService } from '../../../indexed-db.service';
import { AnonymousVotingService } from '../../../services/anonymous-voting.service';

@Component({
  selector: 'app-anonymous-voting',
  templateUrl: './anonymous-voting.component.html',
  styleUrls: ['./anonymous-voting.component.scss'],
})
export class AnonymousVotingComponent implements OnInit {

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private db: IndexedDbService,
    private anonymousVotingService: AnonymousVotingService) {

    this.form = this.fb.group({
      accepted: ['', [Validators.required]],
    });

  }

  async ngOnInit(): Promise<void> {

    this.userHasvotingsData$ = await this.anonymousVotingService.getAllUserHasVotingsPromiseObservableIItemArray();

    await this.route.queryParams.subscribe(async (params: Params) => {

      this.userId = params['user_id'];

      this.unitId = params['unit_id'];

      this.votingId = params['voting_id'];

      this.uniqueKey = params['unique_key'];

      if (this.userId && this.unitId && this.votingId && this.uniqueKey) {

        await this.db.set(this.db.AnonymousVotingQueryParamsKey, {
          userId: this.userId,
          unitId: this.unitId,
          votingId: this.votingId,
          uniqueKey: this.uniqueKey,
        });

        const newUrl = this.router.url.split('?')[0];

        await this.router.navigateByUrl(newUrl);

      }
      else {

        let queryParams = (await this.db.get(this.db.AnonymousVotingQueryParamsKey)).value;

        console.log(queryParams);

        this.userId = queryParams.userId;

        this.unitId = queryParams.unitId;

        this.votingId = queryParams.votingId;

        this.uniqueKey = queryParams.uniqueKey;

        await (await this.anonymousVotingService.getAnonymousVotingByUnitIdAndVotingIdAsync(this.unitId, this.votingId)).subscribe(
          (response: any) => {

            this.loading = false;

            this.meetingDateLabel = response.meetingDate;

            this.votingDescriptionLabel = response.description;

            this.unitNumberLabel = 'Casa #' + response.unitNumber;

            console.log('voto anónimo consumido exitosamente', response);
          },
          (response: any) => {

            this.loading = false;

            if (response.error != null && response.error.error != null) {

              this.errorMessage = response.error.error;

            }

            this.error = true;

            console.error('Error al extraer el voto anónimo', response);

          }
        );
      }
    });

  }

  title = 'Votación Anónima';

  form: FormGroup;

  protected loadingMessage: string = "Por favor, espere...";

  protected loading: boolean = true;

  userHasvotingsData$!: Observable<IItem[]>;

  userId: string = '';

  unitId: string = '';

  votingId: string = '';

  uniqueKey: string = '';

  meetingDateLabel: string = 'Fecha de Asamblea:';

  votingDescriptionLabel: string = 'Tema de Votación:';

  unitNumberLabel: string = '# de Casa:';

  accepted: string = "";

  protected errorMessage: string = "";

  protected error: boolean = false;

  async vote(): Promise<void> {

    this.loading = true;

    if (this.accepted == "") {

      this.error = true;

      this.errorMessage = "Debe indicar si está a favor o en contra";

      this.loading = false;

      return;
    }

    this.error = false;

    this.errorMessage = "";

    let bodyVote = {
      unitId: this.unitId, votingId: this.votingId,
      userId: this.userId, uniqueKey: this.uniqueKey,
      accepted: this.accepted
    };

    await (await this.anonymousVotingService.createAnonymousVotingAsync(bodyVote)).subscribe(
      (response: any) => {

        this.loading = false;

        this.meetingDateLabel = response.meetingDate;

        this.votingDescriptionLabel = response.description;

        this.unitNumberLabel = 'Casa #' + response.unitNumber;

        console.log('voto anónimo consumido exitosamente', response);

      },
      (response: any) => {

        this.loading = false;

        if (response.error != null && response.error.error != null) {

          this.errorMessage = response.error.error;

        }

        this.error = true;

        console.error('Error al extraer el voto anónimo', response);

      }
    );

  }
}
