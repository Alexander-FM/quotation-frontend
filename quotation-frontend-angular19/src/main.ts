import { bootstrapApplication } from '@angular/platform-browser';
import { definePreset } from '@primeng/themes';
import Lara from '@primeng/themes/lara';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Apply PrimeNG theme preset
definePreset(Lara);

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
