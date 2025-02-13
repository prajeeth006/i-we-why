import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { ElementKeyDirective } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { ElementRepositoryServiceMock } from '../../../core/test/browsercommon/element-repository.mock';

@Component({
    template: '<div vnElementKey="SOME_KEY"></div>',
})
class TestHostComponent {
    attrs: any;
}

describe('HtmlAttrsDirective', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let elementRepositoryServiceMock: ElementRepositoryServiceMock;

    beforeEach(() => {
        elementRepositoryServiceMock = MockContext.useMock(ElementRepositoryServiceMock);

        TestBed.configureTestingModule({
            imports: [ElementKeyDirective],
            providers: [MockContext.providers],
            declarations: [TestHostComponent],
        });

        fixture = TestBed.createComponent(TestHostComponent);
        fixture.componentInstance.attrs = { class: 'foo', title: 'Hello', id: 'new_id' };

        fixture.detectChanges();
    });

    function getElement(): HTMLElement {
        return fixture.debugElement.query(By.css('div')).nativeElement;
    }

    it('should register element with repository', () => {
        expect(elementRepositoryServiceMock.register).toHaveBeenCalledWith('SOME_KEY', getElement());
    });

    it('should remove element from repository on destroy', () => {
        fixture.destroy();

        expect(elementRepositoryServiceMock.remove).toHaveBeenCalledWith('SOME_KEY');
    });
});
