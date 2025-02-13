import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';
import { Subject } from 'rxjs';

import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { ClaimsServiceMock } from '../../../core/test/user/claims.mock';
import { AccountMenuVipService } from '../src/account-menu-vip.service';
import { AccountMenuConfigMock } from './menu-content.mock';

describe('AccountMenuVipService', () => {
    let service: AccountMenuVipService;
    let menuContentMock: AccountMenuConfigMock;
    let dslServiceMock: DslServiceMock;
    let claimsServiceMock: ClaimsServiceMock;
    let dslSubject: Subject<boolean>;

    beforeEach(() => {
        menuContentMock = MockContext.useMock(AccountMenuConfigMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        claimsServiceMock = MockContext.useMock(ClaimsServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, AccountMenuVipService],
        });

        menuContentMock.account.vipLevels = ['GOLD', 'PLATINUM'];
        menuContentMock.vipLevels = [
            <any>{ name: 'level_GOLD', url: '', image: { src: 'GOLD.png' }, text: 'GOLD' },
            <any>{ name: 'level_PLATINUM', url: '', image: { src: 'PLATINUM.png' }, text: 'PLATINUM' },
            <any>{ name: 'level_BRONZE', url: '', image: { src: 'BRONZE.png' }, text: 'BRONZE' },
        ];
        dslSubject = new Subject<boolean>();

        dslServiceMock.evaluateExpression.withArgs('cond').and.returnValue(dslSubject);

        service = TestBed.inject(AccountMenuVipService);
    });

    describe('isVip', () => {
        testVip('BRONZE', 'BRONZE', 'BRONZE.png', false);
        testVip('', undefined, undefined, false);
        testVip(null, undefined, undefined, false);
        testVip('GOLD', 'GOLD', 'GOLD.png', true);
        testVip('PLATINUM', 'PLATINUM', 'PLATINUM.png', true);

        function testVip(level: string | null, label: string | undefined, icon: string | undefined, result: boolean) {
            it(`should return ${result} for ${level}`, () => {
                claimsServiceMock.get.withArgs('http://api.bwin.com/v3/user/vipLevel').and.returnValue(level);

                expect(service.isVip).toBe(result);
                if (level) {
                    expect(service.vipLevel).toBe(level);
                    expect(service.vipLabel).toBe(label!);
                    expect(service.vipIcon).toBe(icon!);
                }
            });
        }
    });
});
