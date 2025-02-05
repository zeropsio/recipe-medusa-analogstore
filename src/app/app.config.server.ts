import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';

import { appConfig } from './app.config';
import { provideMedusaConfig } from './services/medusa.service';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { requestContextInterceptor } from '@analogjs/router';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideHttpClient(
      withFetch(),
      withInterceptors([requestContextInterceptor])
    ),
    provideMedusaConfig({
      baseUrl: import.meta.env['VITE_MEDUSA_BACKEND_URL'] || '',
      publishableKey: import.meta.env['VITE_MEDUSA_CHANNEL_PUBLISHABLE_KEY'],
    }),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
