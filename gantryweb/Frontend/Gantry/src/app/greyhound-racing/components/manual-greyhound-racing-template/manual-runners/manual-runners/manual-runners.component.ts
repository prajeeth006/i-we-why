import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ManualGreyhoundRacingTemplateService } from 'src/app/greyhound-racing/components/manual-greyhound-racing-template/services/manual-greyhound-racing-template.service'
import { EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Component({
  selector: 'gn-manual-runners',
  templateUrl: './manual-runners.component.html',
  styleUrls: ['./manual-runners.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManualRunnersComponent {

  vm$ = this.manualGreyhoundRacingTemplateService.data$
    .pipe(
      map(result => {
        return result.manualGreyhoundRacingRunners;
      }),
      catchError(err => {
        return EMPTY;
      })
    )

  constructor(private manualGreyhoundRacingTemplateService: ManualGreyhoundRacingTemplateService) {

  }
}
