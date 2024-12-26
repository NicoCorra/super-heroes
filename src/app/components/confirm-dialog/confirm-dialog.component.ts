
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Heroe } from './../../interfaces/heroe.interface';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material/material.module';
import { ImageHeroePipe } from '../../pipes/image-heroe.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, CommonModule, ImageHeroePipe, RouterLink],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Heroe,
  ) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onConfirm():void {
    this.dialogRef.close(true)
  }
}
