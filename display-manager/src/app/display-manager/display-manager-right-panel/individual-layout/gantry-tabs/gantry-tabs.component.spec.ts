import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GantryTabsComponent } from './gantry-tabs.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTreeModule } from '@angular/material/tree';

describe('GantryTabsComponent', () => {
  let component: GantryTabsComponent;
  let fixture: ComponentFixture<GantryTabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatTreeModule,
        MatExpansionModule,
        GantryTabsComponent
      ]
    });
    fixture = TestBed.createComponent(GantryTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
