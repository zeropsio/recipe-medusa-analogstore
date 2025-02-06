import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';

import { appConfig } from './app.config';
import { provideMedusaConfig } from './services/medusa.service';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideMedusaConfig({
      baseUrl: import.meta.env['VITE_MEDUSA_BACKEND_URL'] || '',
      publishableKey: import.meta.env['VITE_MEDUSA_CHANNEL_PUBLISHABLE_KEY'],
    }),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
