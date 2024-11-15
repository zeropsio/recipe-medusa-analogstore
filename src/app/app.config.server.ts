import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';

import { appConfig } from './app.config';
import { provideImgproxyLoader } from './services/imgproxy.loader';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideImgproxyLoader()
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
