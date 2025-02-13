import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndividualLayoutComponent } from './individual-layout.component';
import { IndividualConfigurationService } from './services/individual-configuration.service';
import { LabelSelectorService } from '../../display-manager-header/label-selector/label-selector.service';
import { ApiService } from 'src/app/common/api.service';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('IndividualLayoutComponent', () => {
  let component: IndividualLayoutComponent;
  let fixture: ComponentFixture<IndividualLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualLayoutComponent, HttpClientModule, HttpClientTestingModule, RouterTestingModule, NoopAnimationsModule],
      providers: [
        IndividualConfigurationService,
        LabelSelectorService,
        ApiService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(IndividualLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
