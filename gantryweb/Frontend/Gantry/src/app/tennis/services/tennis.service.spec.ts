import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed } from '@angular/core/testing';
import { MockContext } from 'moxxi';
import { ActivatedRouteMock } from '../../common/mocks/activated-route.mock';
import { SportBookService } from '../../common/services/data-feed/sport-book.service';
import { TennisContentService } from './tennis-content.service';
import { TennisService } from './tennis.service';

describe("TennisService", () => {
  let tennisService: TennisService;
  let sportBookService: SportBookService;

  beforeEach(() => {
    MockContext.useMock(ActivatedRouteMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [TennisContentService, SportBookService]
    });
    tennisService = TestBed.inject(TennisService);
    sportBookService = TestBed.inject(SportBookService);
  });

  it('should be created', () => {
    expect(tennisService).toBeTruthy();
  });

  it('should be call setEvenKeyAndMarketKeys', () => {
    spyOn(sportBookService, 'setEventMarketsList');
    tennisService.setEvenKeyAndMarketKeys('123', '123');
    expect(sportBookService.setEventMarketsList).toHaveBeenCalled();
  });

});