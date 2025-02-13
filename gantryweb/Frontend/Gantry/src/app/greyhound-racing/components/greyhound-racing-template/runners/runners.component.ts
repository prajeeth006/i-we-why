import { ChangeDetectionStrategy, Component } from '@angular/core';
import { catchError, EMPTY, map } from 'rxjs';
import { SelectionSuspended } from 'src/app/common/models/general-codes-model';
import { GreyhoundRacingTemplateService } from '../services/greyhound-racing-template.service';

@Component({
  selector: 'gn-greyhound-runners',
  templateUrl: './runners.component.html',
  styleUrls: ['./runners.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GreyhoundRunnersComponent {
  isEventResulted: boolean = false;
  selectionAndPrice = SelectionSuspended.selectionAndPrice;

  vm$ = this.greyhoundRacingTemplateService.data$
    .pipe(
      map(result => {
        this.isEventResulted = result.isAnyEventResulted;
        if (result.greyhoundRacingRunnersResult && !result?.greyhoundRacingRunnersResult?.isVirtualEvent) {
          result.greyhoundRacingRunnersResult.greyhoundRacingEntries = result.greyhoundRacingRunnersResult.greyhoundRacingEntries.filter((runner) => {
            let notToRemove = false;
            Object.keys(runner.hideEntry).map(key => {
               if (runner.hideEntry[key] !=true && runner.hideEntry[key] !=undefined) {
                  notToRemove =true;
              }
            });
            return notToRemove;
          })
        }

        return result.greyhoundRacingRunnersResult
      }),
      catchError(err => {
        return EMPTY;
      })
    );

  constructor(private greyhoundRacingTemplateService: GreyhoundRacingTemplateService) { }

}
