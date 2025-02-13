import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SequenceModelPopUpComponent } from './sequence-popup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('NewSequencePresetCarouselComponent', () => {
  let component: SequenceModelPopUpComponent;
  let fixture: ComponentFixture<SequenceModelPopUpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        SequenceModelPopUpComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SequenceModelPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
