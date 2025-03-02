import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
// import { ActivatedRoute } from '@angular/router';
// import { StoreRegion } from '@medusajs/types';
// import { map } from 'rxjs';
import { FeaturedProductsComponent } from 'src/app/features/feature-products/featured-products.component';
// import { MedusaService } from 'src/app/services/medusa.service';
import { HeroComponent } from 'src/app/shared/hero.component';
import { injectLoad } from '@analogjs/router';
import { load } from './index.server';

@Component({
  selector: 'country-code-default-page',
  imports: [HeroComponent, FeaturedProductsComponent, JsonPipe],
  template: `
    <app-hero />
    <h5>Debug 2</h5>
    <pre>{{ serverData().collections | json }}</pre>
    <div class="py-12 bg-background">
      <ul class="flex flex-col gap-x-6">
        @if(serverData().collections && serverData().region){
        <featured-products
          [collections]="serverData().collections"
          [region]="serverData().region"
        />
        }
      </ul>
    </div>
  `,
})
export default class CountryCodeIndexPageComponent {
  // Use injectLoad to get data from server-side load function
  protected serverData = toSignal(injectLoad<typeof load>(), {
    requireSync: true,
  });
}
