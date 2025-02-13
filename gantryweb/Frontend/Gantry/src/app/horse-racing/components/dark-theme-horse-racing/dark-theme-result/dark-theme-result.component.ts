import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { map, catchError, EMPTY } from 'rxjs';
import { DarkThemeResultService } from './services/dark-theme-result.service';

@Component({
  selector: 'gn-dark-theme-result',
  templateUrl: './dark-theme-result.component.html',
  styleUrls: ['./dark-theme-result.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DarkThemeResultComponent {
  @Input() isHalfScreenType: boolean;
  showAbondendMessage: boolean = false;
  vm$ = this.darkThemeResultService.data$
    .pipe(
      map(result => {
        return result
      }),
      catchError(err => {
        return EMPTY;
      })
    );

  constructor(private darkThemeResultService: DarkThemeResultService) { }
}
