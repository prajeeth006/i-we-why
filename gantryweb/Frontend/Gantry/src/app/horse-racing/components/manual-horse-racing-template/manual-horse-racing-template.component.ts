import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ManualHorseRacingTemplateService } from './services/manual-horse-racing-template.service';
import { ManualHorseRacingResponse } from '../../models/horse-racing-manual-template.model';
import { EMPTY, catchError, tap } from 'rxjs';

@Component({
  selector: 'gn-manual-horse-racing-template',
  templateUrl: './manual-horse-racing-template.component.html',
  styleUrls: ['./manual-horse-racing-template.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // reacts only on observable change (not normal property change - more optimized)
  encapsulation: ViewEncapsulation.None
})
export class ManualHorseRacingTemplateComponent {
  errorMessage$ = this.manualHorseRacingTemplateService.errorMessage$;

  vm$ = this.manualHorseRacingTemplateService.data$
    .pipe(
      tap((result: ManualHorseRacingResponse) => {
      }),
      catchError(err => {
        return EMPTY;
      })
    )

  constructor(
    private manualHorseRacingTemplateService: ManualHorseRacingTemplateService
  ) {
  }
}
