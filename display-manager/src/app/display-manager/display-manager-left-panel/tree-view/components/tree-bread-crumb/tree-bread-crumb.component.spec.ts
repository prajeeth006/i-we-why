import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeBreadCrumbComponent } from './tree-bread-crumb.component';

describe('TreeBreadCrumbComponent', () => {
  let component: TreeBreadCrumbComponent;
  let fixture: ComponentFixture<TreeBreadCrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeBreadCrumbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeBreadCrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
