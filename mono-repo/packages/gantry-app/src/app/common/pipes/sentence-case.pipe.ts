// sentence-case.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sentenceCase',
})
export class SentenceCasePipe implements PipeTransform {
    transform(value: string): string {
        if (!value) return value;

        // Split the string into sentences
        const sentences = value.split('. ');

        // Capitalize the first letter of each sentence
        const sentenceCaseSentences = sentences.map((sentence) => {
            return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
        });

        // Join the sentences back into a string
        const sentenceCaseString = sentenceCaseSentences.join('. ');

        return sentenceCaseString;
    }
}
