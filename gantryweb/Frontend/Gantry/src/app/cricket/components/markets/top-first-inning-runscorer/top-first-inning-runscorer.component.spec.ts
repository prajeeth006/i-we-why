import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopFirstInningRunscorerComponent } from './top-first-inning-runscorer.component';

describe('TopFirstInningRunscorerComponent', () => {
  let component: TopFirstInningRunscorerComponent;
  let fixture: ComponentFixture<TopFirstInningRunscorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopFirstInningRunscorerComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopFirstInningRunscorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
