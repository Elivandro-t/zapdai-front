import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideNgxMask  } from 'ngx-mask';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthInterceptors } from './interceptors/AuthInterceptors.interceptors';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';

registerLocaleData(ptBr);


export const appConfig: ApplicationConfig = {
  providers: [
    
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    {
      provide:HTTP_INTERCEPTORS,
      useClass:AuthInterceptors,
      multi:true
    },
    MatSnackBarModule,
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideClientHydration(withEventReplay()),
    provideHttpClient(withInterceptorsFromDi(),
    withFetch()),
    provideAnimations(),
    provideNgxMask(),
  ]
};
