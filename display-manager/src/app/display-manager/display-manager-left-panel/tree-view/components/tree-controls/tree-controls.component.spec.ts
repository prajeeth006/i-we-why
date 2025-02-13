import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeControlsComponent } from './tree-controls.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TreeControlsComponent', () => {
  let component: TreeControlsComponent;
  let fixture: ComponentFixture<TreeControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeControlsComponent ],
      imports: [ HttpClientTestingModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
