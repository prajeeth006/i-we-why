import { DefaultUrlSerializer, UrlTree } from '@angular/router';

/**
 * @whatItDoes Serializes and deserializes a URL string into a URL tree.
 *
 * @howToUse Register it as `UrlSerializer` in your `AppModule`.
 *
 * ```
 * providers: [
 *  ...
 *      { provide: UrlSerializer, useClass: LowerCaseUrlSerializer },
 *  ...
 * ],
 * ```
 *
 * @description
 *
 * The applied url serialization strategy makes all URLs case insensitive.
 *
 * @stable
 */
export class LowerCaseUrlSerializer extends DefaultUrlSerializer {
    override parse(url: string): UrlTree {
        const urlParts = url.split('?');
        urlParts[0] = urlParts[0]!.toLowerCase();
        return super.parse(urlParts.join('?'));
    }
}
