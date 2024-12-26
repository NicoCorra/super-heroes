import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ErroResponseInterceptor } from './shared/error-response.interceptor';
import { PaginatorIntlService } from './services/paginator-intl.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      withInterceptors([ErroResponseInterceptor])),
    PaginatorIntlService,
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: ErroResponseInterceptor,
      multi: true,
    },
  ]
};
