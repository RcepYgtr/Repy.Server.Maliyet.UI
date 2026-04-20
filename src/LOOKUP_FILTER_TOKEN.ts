import { InjectionToken } from "@angular/core";

export const LOOKUP_FILTER_TOKEN =
  new InjectionToken<{ apply: (value: any) => void }>('LOOKUP_FILTER');
