import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../../common/mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../common/mocks/route-data-service.mock';

import { MoneyBoostComponent } from './money-boost.component';
import { SportBookEventStructured } from '../../../common/models/data-feed/sport-bet-models';

describe('MoneyBoostComponent', () => {
  let component: MoneyBoostComponent;
  let fixture: ComponentFixture<MoneyBoostComponent>;

  beforeEach(async () => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ MoneyBoostComponent ],
      providers: [ MockContext.providers ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyBoostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('Page shouldn\'t broke because of unexpected DF data', () => {
    expect(component.prepareMoneyBoostResult(new SportBookEventStructured())).not.toBeUndefined();
  });

});
