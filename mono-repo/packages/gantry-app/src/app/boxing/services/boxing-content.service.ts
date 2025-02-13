import { Injectable } from '@angular/core';

import { ContentItemPaths } from '../../common/models/sport-content/sport-content-parameters.constants';
import { SportContentService } from '../../common/services/sport-content/sport-content.service';

@Injectable({
    providedIn: 'root',
})
export class BoxingContentService {
    data$ = this.sportContentService.getContent(ContentItemPaths.boxing);

    constructor(private sportContentService: SportContentService) {}
}
