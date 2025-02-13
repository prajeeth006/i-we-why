import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { SportBookEventStructured } from '../../../../common/models/data-feed/sport-bet-models';
import { EventFeedUrlService } from '../../../../common/services/event-feed-url.service';
import { MockData } from '../../../mocks/how-far-mock';
import { DarkThemeHowFarComponent } from './dark-theme-how-far.component';

describe('DarkThemeNonRunnersComponent', () => {
    let component: DarkThemeHowFarComponent;
    let fixture: ComponentFixture<DarkThemeHowFarComponent>;
    let mock: MockData; // Declare mock variable

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DarkThemeHowFarComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [MockContext.providers, EventFeedUrlService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents(); // Compile the component's template

        fixture = TestBed.createComponent(DarkThemeHowFarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        mock = new MockData(); // Initialize mock here
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("Page shouldn't break because of unexpected DF data", () => {
        expect(component.prepareHowFarResult(new SportBookEventStructured())).not.toBeUndefined();
    });

    it('should test market names dynamically', () => {
        const marketKeys = [158856378];
        marketKeys.forEach((key) => {
            const marketName = mock.sportBookEventMock.markets.get(key)?.marketName;
            expect(marketName).toBe('KHAN QWERTY QWERTY QWERTY '); // Replace with expected market name for each key
        });
    });

    it('should set selectionName correctly', () => {
        const expectedSelectionName = ' WIN BY 7.5 LENGTHS OR UNDER';
        const selectionName = mock?.selection?.selectionName;
        expect(selectionName).toEqual(expectedSelectionName);
    });

    it('should check if selectionName and marketName are the same', () => {
        const marketKey = 158856378;
        const expectedSelectionName = 'KHAN QWERTY QWERTY QWERTY ';
        const marketName = mock?.sportBookEventMock?.markets?.get(marketKey)?.marketName;
        const selectionName = mock?.selection1?.selectionName;
        expect(selectionName).toEqual(expectedSelectionName);
        expect(selectionName).toEqual(marketName); // Check if selectionName and marketName are same
    });
});
