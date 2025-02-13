import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'titleCaseExceptPipe',
})
export class TitleCaseExceptPipePipe implements PipeTransform {
    transform(value: string, abbreviations?: string): string {
        if (!value) return value;

        // Define an array of lowercase words to be excluded from title casing
        const prepositions: string[] = ['of', 'or', 'by'];

        // Capitalize the first letters of words, except abbreviations and prepositions
        const newVal: any = value?.split(' ').map((match) => {
            if (abbreviations?.includes(match.toLowerCase())) {
                return match.toUpperCase();
            } else if (prepositions?.includes(match.toLowerCase())) {
                return match.toLowerCase();
            } else {
                return match.charAt(0).toUpperCase() + match.substr(1).toLowerCase();
            }
        });

        return newVal.join(' ');
    }
}
