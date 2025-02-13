import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CricketTemplateComponent } from './cricket-template.component';
import { MockContext } from 'moxxi';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteMock } from '../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../common/mocks/route-data-service.mock';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CricketTemplateComponent', () => {
    let component: CricketTemplateComponent;
    let fixture: ComponentFixture<CricketTemplateComponent>;

    beforeEach(async () => {
        MockContext.useMock(RouteDataServiceMock);
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            declarations: [CricketTemplateComponent],
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CricketTemplateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
