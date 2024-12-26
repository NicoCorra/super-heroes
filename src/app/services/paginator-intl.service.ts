import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class PaginatorIntlService extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Héroes por página';  // Cambia el texto de "Items per page"
  override nextPageLabel = 'Página siguiente';       // Cambia el texto del botón de siguiente
  override previousPageLabel = 'Página anterior';    // Cambia el texto del botón de anterior
  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    const startIndex = page * pageSize;
    const endIndex = Math.min(startIndex + pageSize, length);
    return `${startIndex + 1} - ${endIndex} de ${length}`;
  };
}
