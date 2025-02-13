import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
//import { bootloader } from '@frontend/vanilla';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

//bootloader().then(() => platformBrowserDynamic().bootstrapModule(AppModule)).catch((err: any) => console.error(err));
platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));
