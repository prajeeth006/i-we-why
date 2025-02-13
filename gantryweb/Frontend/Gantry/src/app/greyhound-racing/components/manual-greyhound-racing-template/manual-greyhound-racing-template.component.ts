import { ChangeDetectionStrategy, Component, ViewEncapsulation  } from '@angular/core';
import { ManualGreyhoundRacingTemplateService } from './services/manual-greyhound-racing-template.service';
import { ManualGreyhoundRacingResponse } from '../../models/greyhound-racing-manual-template.model';
import { EMPTY, catchError, tap } from 'rxjs';

@Component({
  selector: 'gn-manual-greyhound-racing-template',
  templateUrl: './manual-greyhound-racing-template.component.html',
  styleUrls: ['./manual-greyhound-racing-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ManualGreyhoundRacingTemplateComponent {

  errorMessage$ = this.manualHorseRacingTemplateService.errorMessage$;

  vm$ = this.manualHorseRacingTemplateService.data$
    .pipe(
      tap((result: ManualGreyhoundRacingResponse) => {
      }),
      catchError(err => {
        return EMPTY;
      })
    )

  constructor(
    private manualHorseRacingTemplateService: ManualGreyhoundRacingTemplateService
  ) {
  }
}

