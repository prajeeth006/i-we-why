import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { HtmlElementMock } from '../../../core/test/element-ref.mock';
import { AccountMenuScrollService } from '../src/account-menu-scroll.service';

describe('AccountMenuScrollService', () => {
    let service: AccountMenuScrollService;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MockContext.providers, AccountMenuScrollService],
        });

        service = TestBed.inject(AccountMenuScrollService);
    });

    describe('scroll', () => {
        it('should notify subscribers when onScroll is called', () => {
            const target = new HtmlElementMock();
            target.scrollTop = 10;
            const spy = jasmine.createSpy();
            service.scroll.subscribe(spy);

            service.onScroll(<any>{ target });

            expect(spy).toHaveBeenCalledWith(10);
        });
    });

    describe('scrollTo', () => {
        it('should notify subscribers when scrollTo is called', () => {
            const spy = jasmine.createSpy();
            service.onScrollTo.subscribe(spy);

            service.scrollTo(10, 10);

            expect(spy).toHaveBeenCalledWith({ x: 10, y: 10 });
        });
    });
});
