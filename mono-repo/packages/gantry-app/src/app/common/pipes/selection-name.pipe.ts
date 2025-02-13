import { Pipe, PipeTransform } from '@angular/core';

import { StringHelper } from '../helpers/string.helper';

@Pipe({
    name: 'trimSelectionNamePipe',
})
export class TrimSelectionNamePipe implements PipeTransform {
    transform(selectionName: string, selectionLength: number): string {
        return (selectionName = StringHelper.checkSelectionNameLengthAndTrimEnd(selectionName, selectionLength));
    }
}
