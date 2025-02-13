import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { IntlServiceMock } from '../../../core/test/intl/intl.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { JackpotWinnerPopupComponent } from '../src/jackpot-winner-popup.component';
import { JackpotWinnerConfig } from '../src/jackpot-winner.client-config';
import { JackpotWinnerEvent, PLAYER_GAME_JACKPOT_WIN } from '../src/jackpot-winner.models';

describe('JackpotWinnerPopupComponent', () => {
    let fixture: ComponentFixture<JackpotWinnerPopupComponent>;

    beforeEach(() => {
        MockContext.useMock(OverlayRefMock);

        TestBed.overrideComponent(JackpotWinnerPopupComponent, {
            set: {
                imports: [CommonModule],
                providers: [
                    JackpotWinnerConfig,
                    IntlServiceMock,
                    MockContext.providers,
                    {
                        provide: PLAYER_GAME_JACKPOT_WIN,
                        useValue: {
                            currency: 'USD',
                            winValue: '1000',
                        } as JackpotWinnerEvent,
                    },
                ],
            },
        });

        fixture = TestBed.createComponent(JackpotWinnerPopupComponent);
    });

    it('should set item', () => {
        expect(fixture.componentInstance.item).toEqual({
            currency: 'USD',
            winValue: '1000',
        });
    });
});
