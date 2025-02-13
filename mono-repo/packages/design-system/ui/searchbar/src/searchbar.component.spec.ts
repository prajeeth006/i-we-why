import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DsSearchHarness } from '@frontend/ui/searchbar/testing';
import { virtual } from '@guidepup/virtual-screen-reader';

import { DsSearchInput } from './ds-searchbar-directive';
import { DsSearchBar } from './searchbar.component';

@Component({
    standalone: true,
    imports: [DsSearchBar, DsSearchInput, FormsModule, ReactiveFormsModule, NgIf],
    template: `
        <ds-search-bar placeholder="search1" [inverse]="inverse">
            <input dsSearchInput data-testid="ds-search-input" />
        </ds-search-bar>
        <ds-search-bar placeholder="search2" [inverse]="inverse">
            <input dsSearchInput data-testid="ds-search-input" />
            <ng-template #searchIcon>Search Icon</ng-template>
            <ng-template #closeIcon>Clear Search Icon</ng-template>
        </ds-search-bar>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsSearchTest {
    @Input()
    inverse = false;
}

describe('DsSearchHarness', () => {
    let fixture: ComponentFixture<DsSearchTest>;
    let loader: HarnessLoader;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DsSearchTest],
        }).compileComponents();

        fixture = TestBed.createComponent(DsSearchTest);
        loader = TestbedHarnessEnvironment.loader(fixture);
        fixture.detectChanges();
    });

    it('should load search harnesses', async () => {
        const harnesses = await loader.getAllHarnesses(DsSearchHarness);
        expect(harnesses.length).toBe(2);
    });

    it('should load search with right clear text', async () => {
        const harnesses = await loader.getAllHarnesses(DsSearchHarness.with({ placeholder: 'search2' }));
        expect(harnesses.length).toBe(1);
        expect(await harnesses[0].getClearSearchAttribute()).toBe('search2');
    });

    it('should load search with regex clear text match', async () => {
        const harnesses = await loader.getAllHarnesses(DsSearchHarness.with({ placeholder: /search/i }));
        expect(harnesses.length).toBe(2);
        expect(await harnesses[0].getClearSearchAttribute()).toBe('search1');
        expect(await harnesses[1].getClearSearchAttribute()).toBe('search2');
    });

    it('should focus and blur input', async () => {
        const search = await loader.getHarness(DsSearchHarness);
        const searchInput = await search.getSearchInput();
        expect(await searchInput.isFocused()).toBe(false);
        await searchInput.focus();
        expect(await searchInput.isFocused()).toBe(true);
        await searchInput.blur();
        expect(await searchInput.isFocused()).toBe(false);
    });

    it('should be able to inject icon, and clear icon', async () => {
        const search = await loader.getHarness(DsSearchHarness.with({ placeholder: 'search2' }));
        expect(await (await search.getSearchIconElement())?.text()).toBe('Search Icon');
        expect(await (await search.getClearSearchIconElement())?.text()).toBe('Clear Search Icon');
    });

    it('search1 should be enabled', async () => {
        const search = await loader.getHarness(DsSearchHarness.with({ placeholder: 'search1' }));
        expect(await search.isDisabled()).toBe(false);
    });

    it('should have inverse class when inverse is true', async () => {
        const harness = await loader.getHarness(DsSearchHarness);
        expect(await harness.isInverse()).toBeFalsy();
        fixture.componentRef.setInput('inverse', true);
        expect(await harness.isInverse()).toBeTruthy();
        fixture.componentRef.setInput('inverse', false);
        expect(await harness.isInverse()).toBeFalsy();
    });

    it('test clear icon reset search text nativeElement', async () => {
        const search = await loader.getHarness(DsSearchHarness.with({ placeholder: 'search1' }));
        const input = await search.getSearchInput();
        const clearIcon = await search.getClearSearchIconElement();
        expect(await input.getValue()).toBe('');
        await input.setValue('My search text');
        expect(await input.getValue()).toBe('My search text');
        await clearIcon.click();
        expect(await input.getValue()).toBe('');
    });

    it('should have role search', async () => {
        const search = await loader.getHarness(DsSearchHarness);
        expect(await search.getRole()).toBe('search');
    });

    it('should have aria-label search bar', async () => {
        const search = await loader.getHarness(DsSearchHarness);
        expect(await search.getAriaLabel()).toBe('Search bar');
    });

    it('should read searchbar content correctly with screen reader', async () => {
        fixture.detectChanges();
        await fixture.whenStable();

        await virtual.start({ container: fixture.nativeElement });

        // first searchbar
        expect(await virtual.lastSpokenPhrase()).toBe('search, Search bar');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toBe('textbox');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toBe('button, cleared search field');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toBe('img, clear search field');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toBe('end of button, cleared search field');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toBe('end of search, Search bar');

        // second searchbar
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toBe('search, Search bar');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toBe('textbox');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toBe('button, cleared search field');
        await virtual.next();
        expect(await virtual.lastSpokenPhrase()).toBe('Clear Search Icon');
    }, 30000);
});
