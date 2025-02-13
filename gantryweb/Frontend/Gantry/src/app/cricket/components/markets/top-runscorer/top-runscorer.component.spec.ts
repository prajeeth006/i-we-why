import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRunscorerComponent } from './top-runscorer.component';

describe('TopRunscorerComponent', () => {
  let component: TopRunscorerComponent;
  let fixture: ComponentFixture<TopRunscorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopRunscorerComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopRunscorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
