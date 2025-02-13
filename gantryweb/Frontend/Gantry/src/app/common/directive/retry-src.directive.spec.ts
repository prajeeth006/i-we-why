import { RetrySrcDirective } from './retry-src.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoggerService } from '../services/logger.service';
import { By } from '@angular/platform-browser';
import { BrandImageMockData } from './mock/get-brand-image-data.mock';
import { ImageStatus } from 'src/app/horse-racing/models/fallback-src.constant';

@Component({
  template:'<div><img [retrySrc]="imageUrl" hasFallback="true"></div>'
})
class RetrySrcDirectiveTestComponent{
  imageUrl = '1.png'
}

describe('RetrySrcDirective', () => {
  let component: RetrySrcDirectiveTestComponent;
  let fixture: ComponentFixture<RetrySrcDirectiveTestComponent>;
  let debugElement : DebugElement;
  let mockLoggerSvc: any;
  let brandImageMockData : BrandImageMockData;

  beforeEach(() => {
    mockLoggerSvc = {};
    TestBed.configureTestingModule({
      declarations: [RetrySrcDirective, RetrySrcDirectiveTestComponent],
      imports: [HttpClientTestingModule],
      providers:[{
          provide: LoggerService,
          useValue: mockLoggerSvc
        }]
    }).compileComponents();

    fixture = TestBed.createComponent(RetrySrcDirectiveTestComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement.query(By.directive(RetrySrcDirective));
    brandImageMockData = new BrandImageMockData();
    fixture.detectChanges();    
  });

  it('should create an instance', () => {
    const directive = debugElement.injector.get(RetrySrcDirective);
    expect(directive).toBeTruthy();
  })

  it('should have hasFallback argument for image', () => {
    const directive = debugElement.injector.get(RetrySrcDirective);
    expect(directive.hasFallback).toBeTruthy();
  })

  it('should assign src', (() => {
    const input = fixture.debugElement.nativeElement;
    expect(input.querySelector('img').src).toContain('1.png');
  }));

  it('should do nothing if imageUrl is "Default"', (() => {
    component.imageUrl = ImageStatus.Default;
    fixture.detectChanges();

    if (component.imageUrl === ImageStatus.Default) {
      const input = fixture.debugElement.nativeElement;
      input.querySelector('img').src = '';
      fixture.detectChanges();
      expect(input.querySelector('img').src).toContain('');
    }
  }));

  it('should get silk outlined image if imageUrl is "ImageNotPresent"', (() => {
    component.imageUrl = ImageStatus.ImageNotPresent;
    fixture.detectChanges();

    if (component.imageUrl === ImageStatus.ImageNotPresent) {
      const input = fixture.debugElement.nativeElement;
      let defaultImageUrl = brandImageMockData.silkOutlineImageResponse.brandImage.src;
      input.querySelector('img').src = defaultImageUrl;
      fixture.detectChanges();
      expect(input.querySelector('img').src).toContain('SILK-OUTLINE.png');
    }
  }));

})
