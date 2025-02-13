import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IndividualFooterComponent } from './individual-footer.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('IndividualFooterComponent', () => {
  let component: IndividualFooterComponent;
  let fixture: ComponentFixture<IndividualFooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        IndividualFooterComponent,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatDialogModule,
        CommonModule,
        HttpClientTestingModule
      ]
    });
    fixture = TestBed.createComponent(IndividualFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
