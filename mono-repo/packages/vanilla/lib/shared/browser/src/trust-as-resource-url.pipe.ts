import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * A pipe to bypass security and trust the given value to be a safe resource URL,
 * i.e. a location that may be used to load executable code from, like <script src>, or <iframe src>.
 *
 * WARNING: calling this method with untrusted user data exposes your application to XSS security risks!
 *
 * @stable
 */
@Pipe({ standalone: true, name: 'trustAsResourceUrl', pure: true })
export class TrustAsResourceUrlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}

    public transform(url: string): SafeResourceUrl {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
