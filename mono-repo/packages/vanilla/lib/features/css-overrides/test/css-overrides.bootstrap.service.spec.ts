import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { StylesServiceMock } from '../../../core/src/assets-loading/test/styles.mock';
import { DslEnvServiceMock } from '../../../core/test/dsl/dsl-env.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { CssOverridesBootstrapService } from '../src/css-overrides-bootstrap.service';
import { CssOverridesConfigMock } from './css-overrides.client-config.mock';

describe('CssOverridesBootstrapService', () => {
    let service: CssOverridesBootstrapService;
    let stylesServiceMock: StylesServiceMock;
    let dslServiceMock: DslServiceMock;
    let cssOverridesConfigMock: CssOverridesConfigMock;

    beforeEach(() => {
        stylesServiceMock = MockContext.useMock(StylesServiceMock);
        MockContext.useMock(DslEnvServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        cssOverridesConfigMock = MockContext.useMock(CssOverridesConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, CssOverridesBootstrapService],
        });

        service = TestBed.inject(CssOverridesBootstrapService);
    });

    describe('onFeatureInit()', () => {
        it('should add styles', fakeAsync(() => {
            cssOverridesConfigMock.items = [
                { id: 'id1', content: 'content1' },
                { id: 'id2', content: 'content2', condition: 'condition2' },
            ];

            service.onFeatureInit();
            cssOverridesConfigMock.whenReady.next();
            tick();

            expect(stylesServiceMock.addStyle).toHaveBeenCalledWith('id1', 'content1');
            expect(stylesServiceMock.addStyle).not.toHaveBeenCalledWith('id2', 'content2');
            expect(stylesServiceMock.removeStyle).not.toHaveBeenCalled();

            dslServiceMock.evaluateExpression.completeWith(true);
            tick();

            expect(stylesServiceMock.addStyle).toHaveBeenCalledWith('id2', 'content2');
            expect(stylesServiceMock.removeStyle).not.toHaveBeenCalled();
        }));

        it('should remove styles', fakeAsync(() => {
            cssOverridesConfigMock.items = [{ id: 'id1', content: 'content1', condition: 'condition1' }];

            service.onFeatureInit();
            cssOverridesConfigMock.whenReady.next();
            tick();
            dslServiceMock.evaluateExpression.completeWith(false);
            tick();

            expect(stylesServiceMock.addStyle).not.toHaveBeenCalledWith('id1', 'content1');
            expect(stylesServiceMock.removeStyle).toHaveBeenCalledWith('id1');
        }));
    });
});
