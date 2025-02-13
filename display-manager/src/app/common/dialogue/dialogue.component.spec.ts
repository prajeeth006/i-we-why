import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogueComponent } from './dialogue.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DialogueComponent', () => {
  let component: DialogueComponent;
  let fixture: ComponentFixture<DialogueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ DialogueComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} }, // Mock dialog data
        { provide: MatDialogRef, useValue: {} } // Mock dialog reference
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
