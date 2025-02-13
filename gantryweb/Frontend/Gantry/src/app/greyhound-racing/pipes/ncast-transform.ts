import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ncastTransform'
})
export class NcastTransformPipe implements PipeTransform {

    transform(value: string): unknown {
        switch (value?.toLocaleUpperCase()) {
            case 'FC':
                return 'FORECAST';
            case 'TC':
                return 'TRICAST';
            default:
                return '';
        }
    }
}