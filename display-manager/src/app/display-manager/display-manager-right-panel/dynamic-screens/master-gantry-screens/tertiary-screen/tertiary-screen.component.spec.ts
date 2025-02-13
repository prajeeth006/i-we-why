import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TertiaryScreenComponent } from './tertiary-screen.component';

describe('TertiaryScreenComponent', () => {
  let component: TertiaryScreenComponent;
  let fixture: ComponentFixture<TertiaryScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TertiaryScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TertiaryScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
