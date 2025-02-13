import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TennisCdsComponent } from './tennis-cds.component';
import { MockContext } from 'moxxi';
import { RouteDataServiceMock } from '../../../../common/mocks/route-data-service.mock';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteMock } from '../../../../common/mocks/activated-route.mock';

describe('TennisCdsComponent', () => {
  let component: TennisCdsComponent;
  let fixture: ComponentFixture<TennisCdsComponent>;

  beforeEach(async () => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TennisCdsComponent],
      providers: [MockContext.providers],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(TennisCdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});