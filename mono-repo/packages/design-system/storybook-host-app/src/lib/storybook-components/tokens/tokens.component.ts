import { CommonModule, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, booleanAttribute, inject } from '@angular/core';

import { getDesignSystemThemes } from '@design-system/shared-ds-utils';

import { TokenReaderService } from './tokens.component.service';
import { filterTokens } from './tokens.utils';

type SemanticTokens = {
    name: string;
    type: 'color' | 'size' | 'spacing' | 'fontSize' | 'borderRadius' | 'lineHeight' | 'fontWeight' | 'fontFamily' | 'elevation';
    subtype?: 'container-padding' | 'inline' | 'stack';
};

type FontType = 'Label' | 'Body' | 'Title' | 'Headline' | 'Display';
type FontSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const allThemes = getDesignSystemThemes();

@Component({
    selector: 'ds-storybook-tokens',
    templateUrl: './tokens.component.html',
    styleUrls: ['./tokens.component.scss'],
    imports: [NgStyle, CommonModule],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsTokens implements OnInit, OnDestroy, OnChanges {
    @Input({ transform: booleanAttribute }) typographyPage = false;

    @Input() tokenType!: SemanticTokens['type'];
    semanticTokens: SemanticTokens[] = [];
    filteredTokens: SemanticTokens[] = [];
    basePrefix = '--';

    tokenReaderService = inject(TokenReaderService);
    constructor(private cdr: ChangeDetectorRef) {}

    changes?: MutationObserver;

    themeName = '';
    renderFontMap: Record<FontType, FontSize[]> = {
        Label: ['xs', 'sm', 'md', 'lg'],
        Body: ['sm', 'md', 'lg'],
        Title: ['sm', 'md', 'lg'],
        Headline: ['sm', 'md', 'lg', 'xl'],
        Display: ['sm', 'md', 'lg'],
    };

    fontTypes = Object.keys(this.renderFontMap) as FontType[];
    fontSizes = [...new Set(Object.values(this.renderFontMap).flat())] as FontSize[];
    semanticTokensCount = 0;
    filteredTokensCount = 0;

    updateThemeName(bodyClass: string) {
        const bodySplit = bodyClass.split(' ');

        const relevantThemes = Object.entries(allThemes).filter((x) => x[1].split(' ').every((el) => bodySplit.includes(el)));
        if (relevantThemes.length > 0) {
            const themeName = relevantThemes[0][0];
            if (themeName !== this.themeName) {
                this.themeName = themeName;
                this.loadThemeClass();
            }
        }
    }

    loadThemeClass() {
        if (this.themeName === '') {
            console.error('No theme name provided');
            return;
        }
        if (!(this.themeName in allThemes)) {
            console.error('Theme not found');
            return;
        }
        this.tokenReaderService
            .getSemanticTokens(allThemes[this.themeName])
            .then((tokens) => {
                this.semanticTokens = tokens;
                this.filteredTokens = filterTokens(tokens, this.tokenType);
                this.semanticTokensCount = this.semanticTokens.length;
                this.filteredTokensCount = this.filteredTokens.length;
                this.cdr.detectChanges();
            })
            .catch((error) => {
                console.error('Error fetching tokens:', error);
            });
    }

    ngOnInit() {
        this.updateThemeName(document.body.className);
        this.changes = new MutationObserver(() => {
            this.updateThemeName(document.body.className);
        });
        this.changes.observe(document.body, {
            attributeFilter: ['class'],
        });
    }
    ngOnDestroy(): void {
        if (this.changes) {
            this.changes.disconnect();
        }
    }

    getPreviewContainerStyle(token: any): { [key: string]: any } {
        const style: { [key: string]: any } = {};

        if (token.type === 'color') {
            style['border'] = `1px solid color-mix(in srgb, var(${this.basePrefix}${token.name}) 70%, #8b8680)`;
            style['border-radius'] = `3px`;
            style['background-color'] = `var(${this.basePrefix}${token.name})`;
        } else if (token.type === 'spacing' || token.type === 'size' || token.type === 'borderRadius') {
            style['background-color'] = `color-mix(in srgb, var(--semantic-color-primary-base) 20%, transparent)`;

            if (token.subtype === 'container-padding') {
                style['border'] = `var(${this.basePrefix}${token.name}) solid var(--semantic-color-primary-base)`;
            } else if (token.subtype === 'stack') {
                style['flex-direction'] = `row`;
            }
        }
        return style;
    }

    getCellStyle(token: any): { [key: string]: any } {
        const style: { [key: string]: any } = {};
        const tokenVar = `var(${this.basePrefix}${token.name})`;
        const typeMappings: { [key: string]: string } = {
            fontSize: 'font-size',
            lineHeight: 'line-height',
            fontWeight: 'font-weight',
            fontFamily: 'font-family',
            elevation: 'box-shadow',
        };

        if (typeMappings[token.type]) {
            style[typeMappings[token.type]] = tokenVar;
        } else if (['inline', 'stack'].includes(token.subtype) || ['size', 'borderRadius'].includes(token.type)) {
            style['background-color'] = `var(--semantic-color-primary-base)`;

            if (token.subtype === 'inline' || token.type === 'size') {
                style['width'] = tokenVar;
            } else if (token.subtype === 'stack') {
                style['height'] = tokenVar;
            } else if (token.type === 'borderRadius') {
                style['border-radius'] = tokenVar;
            }
        }

        return style;
    }

    checkFontSize(type: FontType, size: FontSize): boolean {
        return this.renderFontMap[type].includes(size);
    }

    getPieChartDegree(): string {
        if (this.semanticTokensCount === 0) {
            return '0deg';
        }
        return ((this.filteredTokensCount / this.semanticTokensCount) * 360).toFixed(2) + 'deg';
    }

    ngOnChanges() {
        if (this.themeName !== '') {
            this.loadThemeClass();
        }
    }
}
