import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { PaginatorIntlService } from '../../services/paginator-intl.service';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [MatPaginatorModule],
  providers: [
    { provide: MatPaginatorIntl, useClass: PaginatorIntlService }
  ],
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent {
  @Input() length: number | undefined;
  @Input() pageSize: number | undefined;

  @Output() page = new EventEmitter<any>();

  onPageChange(event: any): void {
    this.page.emit(event);
  }
}
