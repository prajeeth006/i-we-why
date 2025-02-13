import { Pipe, PipeTransform } from '@angular/core';

import { of } from 'rxjs';

@Pipe({ name: 'dsl' })
export class MockDslPipe implements PipeTransform {
    transform(value: any) {
        return of(value);
    }
}

@Pipe({ standalone: true, name: 'dsl' })
export class MockDslPipe2 implements PipeTransform {
    transform(value: any) {
        return of(value);
    }
}
