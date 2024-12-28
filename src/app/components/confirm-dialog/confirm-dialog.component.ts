import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MaterialModule } from '../../material/material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, CommonModule],
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {

  // Aceptamos un 'message' genérico para mostrar en el modal
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string },  // Cambiado para aceptar un mensaje
  ) {}

  // Si el usuario hace clic en "No", cerramos el modal y retornamos false
  onNoClick(): void {
    this.dialogRef.close(false);
  }

  // Si el usuario hace clic en "Sí", cerramos el modal y retornamos true
  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
