import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenLayoutTrioComponent } from './screen-layout-trio.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ScreenLayoutSingleComponent } from '../screen-layout-single/screen-layout-single.component';
import { NgClass } from '@angular/common';
import { MockTrio1ScreenData, MockTrio2ScreenData } from '../../../mocks/Individual-tab-gantry-profiles.mock';

describe('ScreenLayoutTrioComponent', () => {
  let component: ScreenLayoutTrioComponent;
  let fixture: ComponentFixture<ScreenLayoutTrioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenLayoutTrioComponent, ScreenLayoutSingleComponent, NgClass, HttpClientTestingModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ScreenLayoutTrioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isTrio1 and screens correctly when ScreenType is "trio1"', () => {
    component.data = MockTrio1ScreenData;
    component.ngOnChanges();  // Manually trigger ngOnChanges in Test case
    expect(component.isTrio1).toBe(true);
    expect(component.isTrio2).toBe(false);
    expect(component._screens()).toEqual(MockTrio1ScreenData.ScreenDetails.Trio1);
  });

  it('should set isTrio2 and screens correctly when ScreenType is "trio2"', () => {
    component.data = MockTrio2ScreenData;
    component.ngOnChanges();

    expect(component.isTrio1).toBe(false);
    expect(component.isTrio2).toBe(true);
    expect(component._screens()).toEqual(MockTrio2ScreenData.ScreenDetails.Trio2);
  });

  it('should handle undefined data input gracefully', () => {
    component.data = undefined;

    expect(component.isTrio1).toBe(false);
    expect(component.isTrio2).toBe(false);
    expect(component._screens()).toBeNull();
  });

  it('should return "H" for the 1st screen in trio1 layout', () => {
    component.isTrio1 = true;
    expect(component.getLayoutStyle(0)).toBe('H');
  });

  it('should return "H" for the 3rd screen in trio2 layout', () => {
    component.isTrio2 = true;
    expect(component.getLayoutStyle(2)).toBe('H');
  });

  it('should return an empty string for non-half screens in trio1 layout', () => {
    component.isTrio1 = true;
    expect(component.getLayoutStyle(1)).toBe('');
    expect(component.getLayoutStyle(2)).toBe('');
  });

  it('should return an empty string for non-half screens in trio2 layout', () => {
    component.isTrio2 = true;
    expect(component.getLayoutStyle(0)).toBe('');
    expect(component.getLayoutStyle(1)).toBe('');
  });
});
