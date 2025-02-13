import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TennisCdsService } from './tennis-cds.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockContext } from 'moxxi';

describe('TennisCdsService', () => {
  let service: TennisCdsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers]
    });
    service = TestBed.inject(TennisCdsService);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
