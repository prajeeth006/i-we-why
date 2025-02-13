import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ncastType',
})
export class NcastTypePipe implements PipeTransform {
    transform(value: string): unknown {
        switch (value?.toLocaleUpperCase()) {
            case 'FC':
                return 'FORECAST';
            case 'TC':
                return 'TRICAST';
            case 'UWIN':
                return 'WIN';
            case 'UPLC':
                return 'PLACE';
            case 'UEXA':
                return 'EXACTA';
            case 'UTRI':
                return 'TRIFECTA';
            case 'UJKP':
                return 'JACKPOT';
            case 'UPLP':
                return 'PLACEPOT';
            case 'UQDP':
                return 'QUADPOT';
            case 'USW':
                return 'SWINGER';
            case 'USC6':
                return 'SCOOP6';
            default:
                return '';
        }
    }
}
