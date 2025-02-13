import { Pipe, PipeTransform } from '@angular/core';

import { ArithmeticService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: ArithmeticService })
export class ArithmeticServiceMock {
    @Stub() solve: jasmine.PromiseSpy;
}

@Pipe({ name: 'vnSolve' })
export class FakeSolvePipe implements PipeTransform {
    transform(value: any) {
        return value;
    }
}

@Pipe({ standalone: true, name: 'vnSolve' })
export class FakeSolvePipe2 implements PipeTransform {
    transform(value: any) {
        return value;
    }
}
