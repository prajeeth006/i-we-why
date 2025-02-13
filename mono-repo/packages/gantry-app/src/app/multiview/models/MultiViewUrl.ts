import { SafeResourceUrl } from '@angular/platform-browser';

import { CarouselUrl } from '../../carousel/models/CarouselUrl';

export class MultiViewUrl {
    url?: string;
    safeUrl?: SafeResourceUrl;
    displayOrder?: number;
    carousel?: CarouselUrl[];
}
