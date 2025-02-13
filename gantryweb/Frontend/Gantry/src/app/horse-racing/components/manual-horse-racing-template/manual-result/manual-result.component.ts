import { AfterViewInit, Component } from '@angular/core';
import { catchError, EMPTY, map } from 'rxjs';
import { ManualHorseRacingResultService } from './services/manual-horse-racing-result.service';
import { ManualHorseRacingResults } from 'src/app/horse-racing/models/horse-racing-manual-template.model';
import { ScreenTypeService } from 'src/app/common/services/screen-type.service';

@Component({
  selector: 'gn-manual-result',
  templateUrl: './manual-result.component.html',
  styleUrls: ['./manual-result.component.scss']
})
export class ManualResultComponent implements AfterViewInit {
  isHalfScreenType = false;
  vm$ = this.horseRacingResultService.data$
    .pipe(
      map((result: ManualHorseRacingResults) => {
        return result
      }),
      catchError(err => {
        return EMPTY;
      })
    );

  constructor(private horseRacingResultService: ManualHorseRacingResultService, private screenTypeService: ScreenTypeService) { }

  ngAfterViewInit(){
    this.isHalfScreenType = this.screenTypeService.isHalfScreenType;
  }
}
