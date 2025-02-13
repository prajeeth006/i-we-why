import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncateAndFormat',
})
export class TruncateAndFormatPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) {
            return '';
        }
        //Selection name is 19 or more characters in length, then first 17 characters from their name should be displayed with 18th Character being an apostrophe ( ' )
        const maxLength = 18;
        let truncatedValue = value?.trim()?.substring(0, maxLength)?.toLowerCase();

        if (value?.trim()?.length > maxLength) {
            truncatedValue = truncatedValue?.trim()?.slice(0, -1) + "'";
        }

        return this.capitalizeFirstWord(truncatedValue);
    }

    private capitalizeFirstWord(value: string): string {
        return value?.replace(/\b\w/g, (char) => char?.toUpperCase());
    }
}
