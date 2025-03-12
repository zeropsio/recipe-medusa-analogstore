import { Component } from '@angular/core';
import { injectLoad } from '@analogjs/router';
import { load } from './index.server';
import { FeaturedProductsComponent } from 'src/app/features/feature-products/featured-products.component';
import { HeroComponent } from 'src/app/shared/hero.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'country-code-default-page',
  imports: [HeroComponent, FeaturedProductsComponent],
  template: `
    <app-hero />
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
