import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterConfigurationComponent } from './master-configuration.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatMenuModule } from '@angular/material/menu';

describe('MasterConfigurationComponent', () => {
  let component: MasterConfigurationComponent;
  let fixture: ComponentFixture<MasterConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MasterConfigurationComponent ],
      imports: [ HttpClientTestingModule,MatMenuModule  ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
