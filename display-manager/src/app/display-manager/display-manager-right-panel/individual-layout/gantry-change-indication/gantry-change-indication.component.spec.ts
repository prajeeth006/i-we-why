import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GantryChangeIndicationComponent } from './gantry-change-indication.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GantryChangeIndicationComponent', () => {
  let component: GantryChangeIndicationComponent;
  let fixture: ComponentFixture<GantryChangeIndicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GantryChangeIndicationComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GantryChangeIndicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
