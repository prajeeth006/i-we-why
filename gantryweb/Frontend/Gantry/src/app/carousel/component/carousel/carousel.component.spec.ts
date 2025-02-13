import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselComponent } from './carousel.component';
import { ActivatedRouteMock } from '../../../common/mocks/activated-route.mock';
import { RouteDataServiceMock } from '../../../common/mocks/route-data-service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockContext } from 'moxxi';

describe('CarouselComponent', () => {
  let component: CarouselComponent;
  let fixture: ComponentFixture<CarouselComponent>;

  beforeEach(async () => {
    
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    await TestBed.configureTestingModule({
      declarations: [ CarouselComponent ],
      providers: [ MockContext.providers ],
      imports: [HttpClientTestingModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
