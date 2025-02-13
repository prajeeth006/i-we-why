import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockContext } from 'moxxi';
import { MultiviewComponent } from './multiview.component';
import { ActivatedRouteMock } from '../../../common/mocks/activated-route.mock';
import { RouteDataServiceMock } from '../../../common/mocks/route-data-service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MultiviewComponent', () => {
  let component: MultiviewComponent;
  let fixture: ComponentFixture<MultiviewComponent>;

  beforeEach(async () => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    await TestBed.configureTestingModule({
      declarations: [ MultiviewComponent ],
      providers: [ MockContext.providers ],
      imports: [HttpClientTestingModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
