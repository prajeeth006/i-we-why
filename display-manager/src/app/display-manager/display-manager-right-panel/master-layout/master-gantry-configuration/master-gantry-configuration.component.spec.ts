import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterGantryConfigurationComponent } from './master-gantry-configuration.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MasterGantryConfigurationComponent', () => {
  let component: MasterGantryConfigurationComponent;
  let fixture: ComponentFixture<MasterGantryConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ MasterGantryConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterGantryConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
