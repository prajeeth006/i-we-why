import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutRightCdsContent } from '../../outright/models/outright-cds.model';
import { DarkThemeOutrightMarketComponent } from './dark-theme-outright-market.component';

describe('DarkThemeOutrightMarketComponent', () => {
    let component: DarkThemeOutrightMarketComponent;
    let fixture: ComponentFixture<DarkThemeOutrightMarketComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DarkThemeOutrightMarketComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeOutrightMarketComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should set "ante-post-small-content" if selection length is between 1 and 6', () => {
        const mockResult = { finalResult: { selections: Array(6).fill({}) } } as OutRightCdsContent;

        component.checkSelectionsLength(mockResult);

        expect(component.mainClassWrapper).toBe('ante-post-small-content');
    });

    it('should set "ante-post-medium-content" if selection length is between 7 and 8', () => {
        const mockResult = { finalResult: { selections: Array(7).fill({}) } } as OutRightCdsContent;

        component.checkSelectionsLength(mockResult);

        expect(component.mainClassWrapper).toBe('ante-post-medium-content');
    });

    it('should set "ante-post-large-content common-ouright-wrapper" if selection length is between 9 and 12', () => {
        const mockResult = { finalResult: { selections: Array(10).fill({}) } } as OutRightCdsContent;

        component.checkSelectionsLength(mockResult);

        expect(component.mainClassWrapper).toBe('ante-post-large-content common-ouright-wrapper');
    });

    it('should set "ante-post-extralarge-content common-ouright-wrapper" if selection length is between 13 and 16', () => {
        const mockResult = { finalResult: { selections: Array(15).fill({}) } } as OutRightCdsContent;

        component.checkSelectionsLength(mockResult);

        expect(component.mainClassWrapper).toBe('ante-post-extralarge-content common-ouright-wrapper');
    });

    it('should set "ante-post-pagination-content common-ouright-wrapper" if selection length is greater than 16', () => {
        const mockResult = { finalResult: { selections: Array(17).fill({}) } } as OutRightCdsContent;

        component.checkSelectionsLength(mockResult);

        expect(component.mainClassWrapper).toBe('ante-post-pagination-content common-ouright-wrapper');
    });

    it('should set "ante-post-small-content" if selection length is 0 or undefined', () => {
        const mockResult = { finalResult: { selections: [] } } as OutRightCdsContent;

        component.checkSelectionsLength(mockResult);

        expect(component.mainClassWrapper).toBe('ante-post-small-content');
    });

    it('should calculate total pages and detect changes on ngOnChanges', () => {
        const calculateTotalPagesSpy = spyOn(component['paginationService'], 'darkThemeCalculateTotalPages');
        const detectChangesSpy = spyOn(component['cd'], 'detectChanges');

        component.pageSize = 5;
        component.isInitialised = false;
        component.result = { finalResult: { selections: Array(10) } } as any; // Mock result with selections

        component.ngOnChanges();

        expect(calculateTotalPagesSpy).toHaveBeenCalledWith(component.pageDetails, component.result.finalResult.selections.length);
        expect(detectChangesSpy).toHaveBeenCalled();
        expect(component.pageDetails.pageSize).toBe(5);
    });

    it('should return boxing image URL when sportName is boxing', () => {
        const mockResult = {
            sportName: 'boxing',
            content: { boxingImage: { src: 'boxing-image-url' } },
        } as OutRightCdsContent;

        const result = component.getSportsTypeImage(mockResult);

        expect(result).toBe('boxing-image-url');
    });

    it('should return cricket image URL when sportName is cricket', () => {
        const mockResult = {
            sportName: 'cricket',
            content: { cricketWhiteImage: { src: 'cricket-image-url' } },
        } as OutRightCdsContent;

        const result = component.getSportsTypeImage(mockResult);

        expect(result).toBe('cricket-image-url');
    });

    it('should return darts image URL when sportName is darts', () => {
        const mockResult = {
            sportName: 'darts',
            content: { dartsImage: { src: 'darts-image-url' } },
        } as OutRightCdsContent;

        const result = component.getSportsTypeImage(mockResult);

        expect(result).toBe('darts-image-url');
    });

    it('should return football image URL when sportName is football', () => {
        const mockResult = {
            sportName: 'football',
            content: { footballImage: { src: 'football-image-url' } },
        } as OutRightCdsContent;

        const result = component.getSportsTypeImage(mockResult);

        expect(result).toBe('football-image-url');
    });

    it('should return formula racing image URL when sportName is formulaRacing', () => {
        const mockResult = {
            sportName: 'formula 1',
            content: { formulaRacingImage: { src: 'formula-racing-image-url' } },
        } as OutRightCdsContent;

        const result = component.getSportsTypeImage(mockResult);

        expect(result).toBe('formula-racing-image-url');
    });

    it('should return golf image URL when sportName is golf', () => {
        const mockResult = {
            sportName: 'golf',
            content: { golfImage: { src: 'golf-image-url' } },
        } as OutRightCdsContent;

        const result = component.getSportsTypeImage(mockResult);

        expect(result).toBe('golf-image-url');
    });

    it('should return nfl image URL when sportName is nfl', () => {
        const mockResult = {
            sportName: 'american football',
            content: { nflImage: { src: 'nfl-image-url' } },
        } as OutRightCdsContent;

        const result = component.getSportsTypeImage(mockResult);

        expect(result).toBe('nfl-image-url');
    });

    it('should return rugby league image URL when sportName is rugbyLeague', () => {
        const mockResult = {
            sportName: 'rugby league',
            content: { rugbyLeagueImage: { src: 'rugby-league-image-url' } },
        } as OutRightCdsContent;

        const result = component.getSportsTypeImage(mockResult);

        expect(result).toBe('rugby-league-image-url');
    });

    it('should return rugby union image URL when sportName is rugbyUnion', () => {
        const mockResult = {
            sportName: 'rugby union',
            content: { rugbyUnionImage: { src: 'rugby-union-image-url' } },
        } as OutRightCdsContent;

        const result = component.getSportsTypeImage(mockResult);

        expect(result).toBe('rugby-union-image-url');
    });

    it('should return tennis image URL when sportName is tennis', () => {
        const mockResult = {
            sportName: 'tennis',
            content: { tennisImage: { src: 'tennis-image-url' } },
        } as OutRightCdsContent;

        const result = component.getSportsTypeImage(mockResult);

        expect(result).toBe('tennis-image-url');
    });

    it('should return snooker image URL when sportName is snooker', () => {
        const mockResult = {
            sportName: 'snooker',
            content: { snookerImage: { src: 'snooker-image-url' } },
        } as OutRightCdsContent;

        const result = component.getSportsTypeImage(mockResult);

        expect(result).toBe('snooker-image-url');
    });

    it('should return an empty string if sportName does not match any case', () => {
        const mockResult = {
            sportName: 'unknownSport',
            content: { boxingImage: { src: 'boxing-image-url' } },
        } as OutRightCdsContent;

        const result = component.getSportsTypeImage(mockResult);

        expect(result).toBe('');
    });
});
