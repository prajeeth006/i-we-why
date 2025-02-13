import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxDesktopGameListComponent } from '../src/components/inbox-desktop-game-list.component';

describe('InboxDesktopGameListComponent', () => {
    let fixture: ComponentFixture<InboxDesktopGameListComponent>;
    let component: InboxDesktopGameListComponent;

    function initComponent() {
        fixture = TestBed.createComponent(InboxDesktopGameListComponent);
        component = fixture.componentInstance;
    }

    it('should create component successfully, properties and functions are defined', () => {
        initComponent();
        expect(component.getSectionTitle).toBeDefined();
    });

    it('should return correct content message on getSectionTitle', () => {
        initComponent();
        const messageKey = 'key';

        const content = { formContent: {}, title: 'title', messages: { 'GameSection.key': 'val' } };
        component.contentMessages = content.messages;
        const result = component.getSectionTitle(messageKey);
        expect(result).toEqual(content.messages['GameSection.key']);
    });

    it('should return key if key not found in message on getSectionTitle', () => {
        initComponent();
        const messageKey = 'notFoundKeykey';

        const content = { formContent: {}, title: 'title', messages: { 'GameSection.key': 'val' } };
        component.contentMessages = content.messages;
        const result = component.getSectionTitle(messageKey);
        expect(result).toEqual(messageKey);
    });
});
