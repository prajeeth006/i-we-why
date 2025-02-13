import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { FooterMenuItemComponent } from '../src/footer-menu-item.component';

describe('FooterMenuItemComponent', () => {
    let fixture: ComponentFixture<FooterMenuItemComponent>;
    let item: any;

    beforeEach(() => {
        TestBed.overrideComponent(FooterMenuItemComponent, {
            set: {
                imports: [],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [MockContext.providers],
            },
        });

        item = {
            url: 'url',
            clickAction: 'action',
            type: 'type',
            name: 'name',
        };

        fixture = TestBed.createComponent(FooterMenuItemComponent);
        fixture.componentInstance.item = item;
        fixture.detectChanges();
    });

    it('PLACEHOLDER - if there is ever any functionality', () => {});
});
