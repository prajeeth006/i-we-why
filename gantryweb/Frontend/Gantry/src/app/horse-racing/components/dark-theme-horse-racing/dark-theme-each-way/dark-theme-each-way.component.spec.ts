import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DarkThemeEachWayComponent } from './dark-theme-each-way.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DarkThemeEachWayComponent', () => {
  let component: DarkThemeEachWayComponent;
  let fixture: ComponentFixture<DarkThemeEachWayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [DarkThemeEachWayComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(DarkThemeEachWayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
