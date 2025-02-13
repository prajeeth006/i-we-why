import { ChangeDetectionStrategy, Component,Input } from '@angular/core';
import { catchError, EMPTY, map } from 'rxjs';
import { HorseRacingResultService } from './services/horse-racing-result.service';

@Component({
  selector: 'gn-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultComponent {
  @Input() isHalfScreenType: boolean;
    showAbondendMessage:boolean= false;
    vm$ = this.horseRacingResultService.data$
    .pipe(
      map(result => {
        return result
      }),
      catchError(err => {
        return EMPTY;
      })
    );

  constructor(private horseRacingResultService: HorseRacingResultService) { }
}
