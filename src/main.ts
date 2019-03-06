// main.ts - Entry point of application, compiles the application (using JIT) and bootstraps the application

import { enableProdMode } from '@angular/core';

// The browser platform with a compiler
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// Import app module - root module that instructs Angular how to assemble the application
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// Compile and launch the module
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
