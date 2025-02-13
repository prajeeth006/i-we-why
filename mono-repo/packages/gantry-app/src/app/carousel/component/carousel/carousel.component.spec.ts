import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../../common/mocks/activated-route.mock';
import { CarouselRouteDataServiceMockHalf } from '../routemocks/carousel-route-data-mock';
import { CarouselComponent } from './carousel.component';

describe('CarouselComponent', () => {
    let component: CarouselComponent;
    let fixture: ComponentFixture<CarouselComponent>;

    beforeEach(async () => {
        MockContext.useMock(CarouselRouteDataServiceMockHalf);
        MockContext.useMock(ActivatedRouteMock);

        await TestBed.configureTestingModule({
            declarations: [CarouselComponent],
            imports: [],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CarouselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('Url should append screentype as half', () => {
        MockContext.useMock(CarouselRouteDataServiceMockHalf);
        const updatedUrl = component.addScreenTypeParam(
            'https://dev.gantry.coral.co.uk/en/gantry/horseracing/latestdesign?eventId=5871273&marketIds=170841151,170841154',
        );
        expect(updatedUrl).toBe(
            'https://dev.gantry.coral.co.uk/en/gantry/horseracing/latestdesign?eventId=5871273&marketIds=170841151%2C170841154&screenType=half',
        );
    });
});
