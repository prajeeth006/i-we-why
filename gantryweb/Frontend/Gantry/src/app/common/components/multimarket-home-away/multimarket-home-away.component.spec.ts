import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultimarketHomeAwayComponent } from './multimarket-home-away.component';

describe('MultimarketHomeAwayComponent', () => {
  let component: MultimarketHomeAwayComponent;
  let fixture: ComponentFixture<MultimarketHomeAwayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultimarketHomeAwayComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultimarketHomeAwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
