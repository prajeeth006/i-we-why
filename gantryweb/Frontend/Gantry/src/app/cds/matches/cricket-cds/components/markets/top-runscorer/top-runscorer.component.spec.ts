import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRunscorerComponent } from './top-runscorer.component';

describe('TopRunscorerComponent', () => {
  let component: TopRunscorerComponent;
  let fixture: ComponentFixture<TopRunscorerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopRunscorerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopRunscorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
