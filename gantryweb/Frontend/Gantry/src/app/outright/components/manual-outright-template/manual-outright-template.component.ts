import { Component, ViewEncapsulation } from '@angular/core';
import { ManualOutrightTemplateService } from '../../services/manual-outright-template.service';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { EMPTY, catchError, tap } from 'rxjs';
import { ManualOutRightResult } from 'src/app/common/models/manual-outright.module';

@Component({
  selector: 'gn-manual-outright-template',
  templateUrl: './manual-outright-template.component.html',
  styleUrls: ['./manual-outright-template.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ManualOutrightTemplateComponent {

  nameLength = SelectionNameLength.Seventeen;
  errorMessage$ = this.manualOutrightTemplateService.errorMessage$;

  vm$ = this.manualOutrightTemplateService.data$
    .pipe(
      tap((result: ManualOutRightResult) => {
      }),
      catchError(err => {
        return EMPTY;
      })
    );



  constructor(
    private manualOutrightTemplateService: ManualOutrightTemplateService
  ) {

  }


}
