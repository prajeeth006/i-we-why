import { Injectable } from '@angular/core';
import { ContentItemPaths } from 'src/app/common/models/sport-content/sport-content-parameters.constants';
import { SportContentService } from 'src/app/common/services/sport-content/sport-content.service';

@Injectable({
  providedIn: 'root'
})
export class FormulaContentService {

  data$ = this.sportContentService.getContent(ContentItemPaths.formula1);


constructor(
  private sportContentService: SportContentService
) { }
}
