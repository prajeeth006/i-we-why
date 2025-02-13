import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsLayoutComponent } from './settings-layout.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from 'src/app/common/api.service';
import { LabelSelectorService } from '../../display-manager-header/label-selector/label-selector.service';
import { RightPanelTabControlService } from '../services/tab-control.service';


describe('SettingsLayoutComponent', () => {
  let component: SettingsLayoutComponent;
  let fixture: ComponentFixture<SettingsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RightPanelTabControlService,
        LabelSelectorService,
        ApiService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
