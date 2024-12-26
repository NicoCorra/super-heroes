import { Component, inject } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.css'
})
export class LoadingComponent {

  loadingService = inject(LoadingService);
  loading = false;

  gOnInit(): void {
    this.loadingService.loading$.subscribe((isLoading) => {
      this.loading = isLoading;
    });
  }
}
