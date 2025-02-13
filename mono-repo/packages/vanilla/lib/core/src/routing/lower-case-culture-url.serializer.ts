import { DefaultUrlSerializer, UrlTree } from '@angular/router';

import { UrlService } from '../navigation/url.service';

/**
 * @whatItDoes Serializes and deserializes a URL string into a URL tree.
 *
 * @description
 *
 * The applied url serialization strategy makes culture in URLs case insensitive.
 *
 * @stable
 */
export class LowerCaseCultureUrlSerializer extends DefaultUrlSerializer {
    private culturePattern: RegExp;

    constructor(private urlService: UrlService) {
        super();
        this.culturePattern = new RegExp(this.urlService.culturePattern, 'gi');
    }

    override parse(url: string): UrlTree {
        const match = this.culturePattern?.exec(url);
        if (match && match[1] && /[A-Z]/.test(match[1])) {
            const lowerCultureSegment = match[1].toLowerCase();

            // Replace the original culture segment with the lowercase version
            url = url.replace(match[1], lowerCultureSegment);
        }

        return super.parse(url);
    }
}
