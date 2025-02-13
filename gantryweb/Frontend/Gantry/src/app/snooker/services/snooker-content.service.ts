import { Injectable } from '@angular/core';
import { ContentItemPaths } from 'src/app/common/models/sport-content/sport-content-parameters.constants';
import { SportContentService } from 'src/app/common/services/sport-content/sport-content.service';

@Injectable({
  providedIn: 'root'
})
export class SnookerContentService {

  data$ = this.sportContentService.getContent(ContentItemPaths.snooker);


  constructor(
    private sportContentService: SportContentService
  ) { }
}
