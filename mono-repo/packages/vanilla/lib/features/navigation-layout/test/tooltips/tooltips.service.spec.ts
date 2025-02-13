import { TestBed } from '@angular/core/testing';

import { ViewTemplate } from '@frontend/vanilla/core';
import { TooltipsService } from '@frontend/vanilla/shared/tooltips';
import { MockContext } from 'moxxi';

describe('TooltipsService', () => {
    let service: TooltipsService;
    let tooltips: { [type: string]: ViewTemplate };
    let types: string[];

    beforeEach(() => {
        tooltips = {
            balance: { text: 'tooltip one' },
            slide: { text: 'tooltip two' },
            restricted: { text: 'tooltip three' },
        };
        types = Object.keys(tooltips);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, TooltipsService],
        });

        service = TestBed.inject(TooltipsService);
        types.forEach((tooltip: string) => service.addTooltip(tooltip, tooltips));
    });

    describe('addTooltips', () => {
        it('should initialize tooltips with active false', () => {
            const firstTooltip = service.getTooltip('balance');
            const secondTooltip = service.getTooltip('slide');
            const thirdTooltip = service.getTooltip('restricted');

            expect(firstTooltip?.isActive).toBeFalse();
            expect(firstTooltip?.text).toBe('tooltip one');

            expect(secondTooltip?.isActive).toBeFalse();
            expect(secondTooltip?.text).toBe('tooltip two');

            expect(thirdTooltip?.isActive).toBeFalse();
            expect(thirdTooltip?.text).toBe('tooltip three');
        });
    });

    describe('getTooltip', () => {
        it('should return empty object if no tooltips', () => {
            expect(service.getTooltip('inexistentItem')).toBeUndefined();
        });
    });

    describe('nextTooltip', () => {
        it('should set next tooltip active', () => {
            const current = 'balance';
            const next = 'slide';
            service.nextTooltip(current);

            const firstTooltip = service.getTooltip(current);
            const secondTooltip = service.getTooltip(next);

            expect(firstTooltip?.isActive).toBeFalse();
            expect(secondTooltip?.isActive).toBeTrue();
        });
    });

    describe('previousTooltip', () => {
        it('should set previous tooltip active', () => {
            const current = 'restricted';
            service.previousTooltip(current);

            const tooltip = service.getTooltip('slide');

            expect(tooltip?.isActive).toBeTrue();
        });
    });

    describe('hasNext', () => {
        it('should return "true"', () => {
            const current = 'balance';
            expect(service.hasNext(current)).toBeTrue();
        });

        it('should return "false"', () => {
            const current = 'restricted';
            expect(service.hasNext(current)).toBeFalse();
        });
    });

    describe('hasPrevious', () => {
        it('should return "true"', () => {
            const current = 'restricted';
            expect(service.hasPrevious(current)).toBeTrue();
        });

        it('should return "false"', () => {
            const current = 'balance';
            expect(service.hasPrevious(current)).toBeFalse();
        });
    });

    describe('closeTooltip', () => {
        beforeEach(() => {
            spyOn(service.activeTooltip, 'next');
            service.closeTooltip();
        });

        it('should set all tooltips inactive', () => {
            Object.keys(tooltips).forEach((item) => {
                const tooltip = service.getTooltip(item);
                expect(tooltip?.isActive).toBeFalse();
            });
        });

        it('should send activeTooltip event', () => {
            expect(service.activeTooltip.next).toHaveBeenCalledWith(null);
        });
    });
});
