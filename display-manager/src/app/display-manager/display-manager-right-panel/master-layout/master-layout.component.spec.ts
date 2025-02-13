import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterLayoutComponent } from './master-layout.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MasterConfigurationService } from './services/master-configuration.service';
import { ApiService } from 'src/app/common/api.service';

describe('MasterLayoutComponent', () => {
  let component: MasterLayoutComponent;
  let fixture: ComponentFixture<MasterLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ MasterLayoutComponent ],
      providers: [
        MasterConfigurationService,  // Provide MasterConfigurationService
        ApiService  // Provide ApiService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
