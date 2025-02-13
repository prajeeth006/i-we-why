import { ChangeDetectionStrategy, Component } from '@angular/core';
import { catchError, EMPTY, map } from 'rxjs';
import { GreyhoundRacingResultService } from './services/greyhound-racing-result.service';

@Component({
  selector: 'gn-greyhound-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GreyhoundResultComponent {

    vm$ = this.greyhoundRacingResultService.data$
    .pipe(
      map(result => {
        return result;
      }),
      catchError(err => {
        return EMPTY;
      })
    );

  constructor(private greyhoundRacingResultService: GreyhoundRacingResultService) { }
}
