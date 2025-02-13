import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterConfigFooterComponent } from './master-config-footer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MasterConfigFooterComponent', () => {
  let component: MasterConfigFooterComponent;
  let fixture: ComponentFixture<MasterConfigFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ MasterConfigFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterConfigFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
