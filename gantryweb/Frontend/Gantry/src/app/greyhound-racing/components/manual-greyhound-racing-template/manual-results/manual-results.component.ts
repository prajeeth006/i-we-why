import { Component } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ManualGreyhoundRacingTemplateService } from './../services/manual-greyhound-racing-template.service';


@Component({
  selector: 'gn-manual-results',
  templateUrl: './manual-results.component.html',
  styleUrls: ['./manual-results.component.scss']
})
export class ManualResultsComponent {

  vm$ = this.manualGreyhoundResultsService.data$
    .pipe(
      map(result => {
        return result.manualGreyhoundRacingResults;
      }),
      catchError(err => {
        return EMPTY;
      })
    )

  constructor(private manualGreyhoundResultsService: ManualGreyhoundRacingTemplateService) {

  }
}
