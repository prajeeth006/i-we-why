import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
@Pipe({
    name: 'vacantCheckTransform',
})
export class VacantCheckTransformPipe implements PipeTransform {
    transform(greyhoundName: string): string {
        if (greyhoundName.toUpperCase().includes('N/R')) {
            return 'VACANT';
        }
        return greyhoundName;
    }
}
