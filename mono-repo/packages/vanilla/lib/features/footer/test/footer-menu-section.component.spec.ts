import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuContentSection } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { FooterMenuSectionComponent } from '../src/footer-menu-section.component';
import { ResponsiveFooterContentMock } from './responsive-footer.mocks';

describe('FooterMenuItemComponent', () => {
    let fixture: ComponentFixture<FooterMenuSectionComponent>;
    let configMock: ResponsiveFooterContentMock;
    let section: MenuContentSection;

    beforeEach(() => {
        configMock = MockContext.useMock(ResponsiveFooterContentMock);

        TestBed.overrideComponent(FooterMenuSectionComponent, {
            set: {
                schemas: [NO_ERRORS_SCHEMA],
                providers: [MockContext.providers],
            },
        });

        section = <MenuContentSection>{
            name: 'name',
        };

        fixture = TestBed.createComponent(FooterMenuSectionComponent);
        fixture.componentRef.setInput('section', section);
    });

    it('should create correct class when not specified', () => {
        fixture.detectChanges();

        expect(fixture.componentInstance.footerClass()).toBe('footer-nav');
    });

    it('should create correct class with expandable mode', () => {
        configMock.expandableModeEnabled = true;
        fixture.detectChanges();

        fixture.componentInstance.toggle();

        expect(fixture.componentInstance.footerClass()).toBe('footer-nav-expanded footer-nav');
    });

    it('should create correct class when specified', () => {
        section = <MenuContentSection>{
            name: 'name',
            class: 'cls',
        };
        fixture.componentRef.setInput('section', section);

        fixture.detectChanges();

        expect(fixture.componentInstance.footerClass()).toBe('footer-nav cls');
    });
});
