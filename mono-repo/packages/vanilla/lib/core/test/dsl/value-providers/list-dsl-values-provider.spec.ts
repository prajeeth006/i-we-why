import { TestBed } from '@angular/core/testing';

import { DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { ListDslValuesProvider } from '../../../src/dsl/value-providers/list-dsl-values-provider';
import { DslListResolverServiceMock } from './dsl-list-resolver.mock';

describe('ListDslValuesProvider', () => {
    let provider: ListDslValuesProvider;
    let dslListResolverServiceMock: DslListResolverServiceMock;

    beforeEach(() => {
        dslListResolverServiceMock = MockContext.useMock(DslListResolverServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, ListDslValuesProvider],
        });

        provider = TestBed.inject(ListDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();
    });

    describe('Contains', () => {
        it('should return result of the list resolver', () => {
            dslListResolverServiceMock.resolve.withArgs({ listName: 'testList', item: 'bla' }).and.returnValue({ passed: true });

            const value = provider.getProviders()['List']!['Contains']('testList', 'bla');

            expect(value).toBeTrue();
        });
    });
});
