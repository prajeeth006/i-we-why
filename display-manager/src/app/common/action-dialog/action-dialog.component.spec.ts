import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActionDialogComponent } from './action-dialog.component';
import { CarouselItemNamePipe } from 'src/app/display-manager/display-manager-left-panel/carousel/filters/carousel-item-name.pipe';

describe('ActionDialogComponent', () => {
  let component: ActionDialogComponent;
  let fixture: ComponentFixture<ActionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ActionDialogComponent,   // Import the standalone component
        HttpClientTestingModule, // Mock HTTP requests
        MatDialogModule,         // Required for dialog components
        MatFormFieldModule,      // Material form field
        MatIconModule,           // Material icons
        MatButtonModule,         // Material buttons
        MatSelectModule,         // Material select dropdown
        DragDropModule,          // CDK drag-drop module
      ],
      providers: [
        CarouselItemNamePipe,    // Add the pipe as a provider
        { provide: MatDialogRef, useValue: {} },  // Mock MatDialogRef
        { provide: MAT_DIALOG_DATA, useValue: {} },  // Mock MatMdcDialogData token
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Suppress unknown element errors
    }).compileComponents();

    fixture = TestBed.createComponent(ActionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
