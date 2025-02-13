import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockContext } from 'moxxi';
import { EventFeedUrlServiceMock } from '../../../common/mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../common/mocks/route-data-service.mock';

import { NonRunnersComponent } from './non-runners.component';
import { NonRunnersService } from '../../services/data-feed/non-runners.service';
import { EventFeedUrlService } from '../../../common/services/event-feed-url.service';
import { RouterTestingModule } from '@angular/router/testing';
import { NonRunnersResult } from '../../models/data-feed/non-runners.model';

describe('NonRunnersComponent', () => {
  let component: NonRunnersComponent;
  let fixture: ComponentFixture<NonRunnersComponent>;

  beforeEach(async () => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(EventFeedUrlServiceMock);
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule, HttpClientTestingModule,  ],
      declarations: [ NonRunnersComponent ],
      providers: [ MockContext.providers,NonRunnersService,EventFeedUrlService   ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonRunnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  

  it('Page shouldn\'t broke because of unexpected DF data', () => {
    expect(component.prepareNonRunnersPageResult(new NonRunnersResult())).not.toBeUndefined();
  });
});
