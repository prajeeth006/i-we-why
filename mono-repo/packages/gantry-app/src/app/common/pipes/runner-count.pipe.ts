import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'runnerCount',
})
export class RunnerCountPipe implements PipeTransform {
    transform(runnerCount: string): string {
        return runnerCount ?? '0';
    }
}
