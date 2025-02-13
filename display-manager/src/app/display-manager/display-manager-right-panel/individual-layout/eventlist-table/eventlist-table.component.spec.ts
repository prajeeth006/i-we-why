import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventlistTableComponent } from './eventlist-table.component';

describe('EventlistTableComponent', () => {
  let component: EventlistTableComponent;
  let fixture: ComponentFixture<EventlistTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EventlistTableComponent]
    });
    fixture = TestBed.createComponent(EventlistTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
