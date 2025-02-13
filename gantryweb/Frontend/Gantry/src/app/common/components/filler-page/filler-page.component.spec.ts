import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FillerPageComponent } from './filler-page.component';
import { MockContext } from 'moxxi';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteMock } from '../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../common/mocks/route-data-service.mock';

describe('FillerPageComponent', () => {
    let component: FillerPageComponent;
    let fixture: ComponentFixture<FillerPageComponent>;

    beforeEach(async () => {
        MockContext.useMock(RouteDataServiceMock);
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        await TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            declarations: [FillerPageComponent],
            providers: [MockContext.providers]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FillerPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
