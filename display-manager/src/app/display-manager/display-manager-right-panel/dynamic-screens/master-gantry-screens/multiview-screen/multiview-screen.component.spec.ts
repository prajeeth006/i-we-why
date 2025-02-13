import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiviewScreenComponent } from './multiview-screen.component';

describe('MultiviewScreenComponent', () => {
  let component: MultiviewScreenComponent;
  let fixture: ComponentFixture<MultiviewScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiviewScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiviewScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
