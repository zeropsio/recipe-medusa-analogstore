import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import {
  provideFileRouter,
  requestContextInterceptor,
  withDebugRoutes,
} from '@analogjs/router';
import { provideMedusaConfig } from './services/medusa.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideFileRouter(withDebugRoutes()),
    provideHttpClient(
      withFetch(),
      withInterceptors([requestContextInterceptor])
    ),
    provideClientHydration(),
    provideMedusaConfig({
      baseUrl: import.meta.env['VITE_MEDUSA_BACKEND_URL'] || '',
      publishableKey: import.meta.env['VITE_MEDUSA_CHANNEL_PUBLISHABLE_KEY'],
    }),
  ],
};
