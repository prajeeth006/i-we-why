import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { MenuActionsServiceMock } from '../../../../../core/test/menu-actions/menu-actions.mock';
import { UserDocumentsServiceMock } from '../../../../user-documents/test/user-documents.service.mock';
import { DocumentsWidgetComponent } from '../../../src/sub-components/widgets/documents-widget.component';
import { AccountMenuRouterMock } from '../../account-menu-router.mock';
import { AccountMenuServiceMock } from '../../account-menu.mock';

describe('DocumentsWidgetComponent', () => {
    let fixture: ComponentFixture<DocumentsWidgetComponent>;
    let userDocumentsServiceMock: UserDocumentsServiceMock;

    beforeEach(() => {
        userDocumentsServiceMock = MockContext.useMock(UserDocumentsServiceMock);
        MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(AccountMenuServiceMock);
        MockContext.useMock(AccountMenuRouterMock);

        TestBed.overrideComponent(DocumentsWidgetComponent, {
            set: {
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(DocumentsWidgetComponent);

        fixture.componentInstance.item = <any>{ resources: {} };

        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should refresh user documents', () => {
            expect(userDocumentsServiceMock.refresh).toHaveBeenCalled();
        });
    });
});
