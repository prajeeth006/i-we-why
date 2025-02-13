import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NavigationEnd, NavigationStart } from '@angular/router';

import { MockContext } from 'moxxi';

import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { RouterMock } from '../../../core/test/router.mock';
import { DomainSpecificActionsBootstrapService } from '../src/domain-specific-actions-bootstrap.service';
import { DomainSpecificActionsConfigMock } from './domain-specific-actions.service.mock';

describe('DomainSpecificActionsBootstrapService', () => {
    let target: DomainSpecificActionsBootstrapService;
    let domainSpecificActionsConfigMock: DomainSpecificActionsConfigMock;
    let routerMock: RouterMock;
    let dslServiceMock: DslServiceMock;
    let loggerMock: LoggerMock;

    beforeEach(() => {
        domainSpecificActionsConfigMock = MockContext.useMock(DomainSpecificActionsConfigMock);
        routerMock = MockContext.useMock(RouterMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        loggerMock = MockContext.useMock(LoggerMock);

        TestBed.configureTestingModule({
            providers: [DomainSpecificActionsBootstrapService, MockContext.providers],
        });
        target = TestBed.inject(DomainSpecificActionsBootstrapService);
    });

    it('onFeatureInit() should activate action', fakeAsync(() => {
        domainSpecificActionsConfigMock.dslAction = 'run';

        target.onFeatureInit();
        domainSpecificActionsConfigMock.whenReady.next();
        tick();

        routerMock.events.next(new NavigationStart(1, 'a'));
        routerMock.events.next(new NavigationEnd(1, 'a', 'a'));
        routerMock.events.next(new NavigationStart(2, 'b'));
        routerMock.events.next(new NavigationEnd(2, 'b', 'b'));

        expect(loggerMock.debug).toHaveBeenCalledOnceWith('Registering domain specific actions for the execution.');
        expect(dslServiceMock.executeAction).toHaveBeenCalledOnceWith(domainSpecificActionsConfigMock.dslAction);
    }));

    it('onFeatureInit() should NOT activate action', fakeAsync(() => {
        target.onFeatureInit();
        domainSpecificActionsConfigMock.whenReady.next();
        tick();

        routerMock.events.next(new NavigationEnd(1, 'a', 'a'));

        expect(dslServiceMock.executeAction).not.toHaveBeenCalled();
        expect(loggerMock.debug).toHaveBeenCalledWith('No domain specific action to be executed.');
    }));
});
