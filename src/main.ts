import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { HttpClientModule } from '@angular/common/http'
 import { importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));{
      providers: [importProvidersFrom(HttpClientModule),
        provideRouter(routes, withHashLocation())
      ]
  }


