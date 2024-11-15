import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideFileRouter, requestContextInterceptor } from '@analogjs/router';
import { provideMedusaConfig } from './services/medusa.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideFileRouter(),
    provideHttpClient(
      withFetch(),
      withInterceptors([requestContextInterceptor])
    ),
    provideClientHydration(),
    provideMedusaConfig({
      baseUrl: import.meta.env['VITE_MEDUSA_INSTANCE_URL'] || '',
      publishableKey: import.meta.env['VITE_MEDUSA_PUBLISHABLE_KEY']
    })
  ],
};
