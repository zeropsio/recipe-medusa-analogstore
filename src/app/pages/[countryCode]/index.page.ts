import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { StoreRegion } from '@medusajs/types';
import { map } from 'rxjs';
import { FeaturedProductsComponent } from 'src/app/features/feature-products/featured-products.component';
import { MedusaService } from 'src/app/services/medusa.service';
import { HeroComponent } from 'src/app/shared/hero.component';

@Component({
  selector: 'country-code-default-page',
  imports: [HeroComponent, FeaturedProductsComponent, JsonPipe],
  template: `
    <app-hero />
    <h5>Debug</h5>
    <pre>{{ collections() | json }}</pre>
    <div class="py-12 bg-background">
      <ul class="flex flex-col gap-x-6">
        @if(collections() && this.region()){
        <featured-products [collections]="collections()" [region]="region()" />
        }
      </ul>
    </div>
  `,
})
export default class CountryCodeIndexPageComponent {
  private readonly _route = inject(ActivatedRoute);
  #medusa = inject(MedusaService);

  protected collections = toSignal(this.#medusa.listCollections());
  protected region = signal<StoreRegion | null | undefined>(null);

  constructor() {
    this._route.paramMap
      .pipe(
        map((params) => params.get('countryCode')),
        takeUntilDestroyed()
      )
      .subscribe(async (regionCode) => {
        if (regionCode && regionCode.length) {
          this.region.set(await this.#medusa.getRegion(regionCode));
        }
      });
  }
}
