import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// ✅ AG Grid modüllerini kaydet
ModuleRegistry.registerModules([AllCommunityModule]);
platformBrowser().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
