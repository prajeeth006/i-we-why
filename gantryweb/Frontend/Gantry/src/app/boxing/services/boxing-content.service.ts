import { Injectable } from '@angular/core';
import { SportContentService } from 'src/app/common/services/sport-content/sport-content.service';
import { ContentItemPaths } from 'src/app/common/models/sport-content/sport-content-parameters.constants';

@Injectable({
  providedIn: 'root'
})
export class BoxingContentService {

  data$ = this.sportContentService.getContent(ContentItemPaths.boxing);


  constructor(
    private sportContentService: SportContentService
  ) { }
}
