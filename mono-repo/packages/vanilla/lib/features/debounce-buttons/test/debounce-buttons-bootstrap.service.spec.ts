import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UserLoginEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { DebounceButtonsBootstrapService } from '../src/debounce-buttons-bootstrap.service';
import { DebounceButtonsConfigMock } from './debounce-button-config.mock';
import { DebounceButtonsServiceMock } from './debounce-button-service.mock';

describe('DebounceButtonsBootstrapService', () => {
    let service: DebounceButtonsBootstrapService;
    let debounceButtonConfigMock: DebounceButtonsConfigMock;
    let debounceButtonServiceMock: DebounceButtonsServiceMock;
    let userServiceMock: UserServiceMock;
    let navigationServiceMock: NavigationServiceMock;

    beforeEach(() => {
        debounceButtonConfigMock = MockContext.useMock(DebounceButtonsConfigMock);
        debounceButtonServiceMock = MockContext.useMock(DebounceButtonsServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DebounceButtonsBootstrapService],
        });

        service = TestBed.inject(DebounceButtonsBootstrapService);
    });

    describe('onFeatureInit()', () => {
        it('should init with configured items', fakeAsync(() => {
            const items: any = [
                {
                    parameters: {
                        debounceTime: '3000',
                        disabledClass: 'disabled',
                        disabledCondition: '',
                        selector: '.menu-item-link',
                    },
                },
                {
                    parameters: {
                        debounceTime: '1000',
                        disabledClass: 'disabled',
                        disabledCondition: '',
                        selector: '.link',
                    },
                },
            ];
            debounceButtonConfigMock.items = items;

            service.onFeatureInit();
            debounceButtonConfigMock.whenReady.next();
            tick();

            expect(debounceButtonServiceMock.init).toHaveBeenCalledWith(items[0].parameters);
            expect(debounceButtonServiceMock.init).toHaveBeenCalledWith(items[1].parameters);
            expect(debounceButtonServiceMock.init).toHaveBeenCalledTimes(2);
        }));

        it('should init after user login event and delay of 2 sec.', fakeAsync(() => {
            service.onFeatureInit();
            debounceButtonConfigMock.whenReady.next();
            tick();

            debounceButtonConfigMock.items = <any>[{ parameters: {} }];
            userServiceMock.triggerEvent(new UserLoginEvent());
            tick(2000);

            expect(debounceButtonServiceMock.init).toHaveBeenCalledWith({});
        }));

        it('should init after location change event and delay of 2 sec.', fakeAsync(() => {
            service.onFeatureInit();
            debounceButtonConfigMock.whenReady.next();
            tick();

            debounceButtonConfigMock.items = <any>[{ parameters: {} }];
            navigationServiceMock.locationChange.next({ previousUrl: 'url1', nextUrl: 'url2', id: 1 });
            tick(2000);

            expect(debounceButtonServiceMock.init).toHaveBeenCalledWith({});
        }));

        it('should NOT init if no items', fakeAsync(() => {
            service.onFeatureInit();
            debounceButtonConfigMock.whenReady.next();
            tick();

            expect(debounceButtonServiceMock.init).not.toHaveBeenCalled();
        }));
    });
});
