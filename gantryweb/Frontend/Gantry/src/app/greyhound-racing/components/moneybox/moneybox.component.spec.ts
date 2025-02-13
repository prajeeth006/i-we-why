import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRouteMock } from '../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../common/mocks/route-data-service.mock';
import { MockContext } from 'moxxi';

import { MoneyboxComponent } from './moneybox.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GreyhoundStaticContent } from '../../models/greyhound-racing-template.model';

describe('MoneyboxComponent', () => {
  let component: MoneyboxComponent;
  let fixture: ComponentFixture<MoneyboxComponent>;

  beforeEach(async () => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MoneyboxComponent],
      providers: [MockContext.providers],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  

  it('Page shouldn\'t broke because of unexpected DF data', () => {
    expect(component.prepareMoneyBoxResult(undefined, new GreyhoundStaticContent())).not.toBeUndefined();
  });
});
