import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenLayoutDuo1Component } from './screen-layout-duo-1.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ScreenLayoutDuo1Component', () => {
  let component: ScreenLayoutDuo1Component;
  let fixture: ComponentFixture<ScreenLayoutDuo1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenLayoutDuo1Component, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenLayoutDuo1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
