import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Constants } from 'src/app/display-manager/display-manager-right-panel/constants/constants';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
  manualConstants = Constants;
  constructor(
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit(): void {
  }
  
  onCancel() {
    this.dialogRef.close(this.manualConstants.btn_cancel);
  }

  onDelete() {
    this.dialogRef.close(this.manualConstants.btn_delete);
  }
}
