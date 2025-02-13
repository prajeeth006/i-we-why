import { TestBed } from '@angular/core/testing';

import { MenuCounters, MenuCountersProvider, MenuCountersService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { MenuItemsServiceMock } from '../../../features/account-menu/test/menu-items.mock';

export class BaseTestCountersProvider implements MenuCountersProvider {
    get order(): number {
        return 0;
    }

    setCounters(counters: MenuCounters): void {
        counters.set('ts', 'ti', 1, 'red');
        counters.set('ts', 'ti2', 3, 'cyan');
        counters.set('ts2', 'ti2', 2, 'blue');
    }
}

export class OverrideTestCountersProvider implements MenuCountersProvider {
    get order(): number {
        return 10;
    }

    setCounters(counters: MenuCounters): void {
        counters.set('ts', 'ti', 5, 'orange');
    }
}

describe('MenuCountersService', () => {
    let service: MenuCountersService;
    let menuItemsServiceMock: MenuItemsServiceMock;

    beforeEach(() => {
        menuItemsServiceMock = MockContext.useMock(MenuItemsServiceMock);

        TestBed.configureTestingModule({
            providers: [MenuCountersService, MockContext.providers],
        });

        service = TestBed.inject(MenuCountersService);
        service.registerProviders([new OverrideTestCountersProvider(), new BaseTestCountersProvider()]);
    });

    it('should apply counters', () => {
        service.update();

        expect(menuItemsServiceMock.setCounter).toHaveBeenCalledWith('ts', 'ti', 5, 'orange', undefined);
        expect(menuItemsServiceMock.setCounter).toHaveBeenCalledWith('ts', 'ti2', 3, 'cyan', undefined);
        expect(menuItemsServiceMock.setCounter).toHaveBeenCalledWith('ts2', 'ti2', 2, 'blue', undefined);
    });
});
