import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MedusaService } from '../services/medusa.service';
import { NgOptimizedImage } from '@angular/common';
import { HeroComponent } from '../shared/hero.component';
import { FeaturedProductsComponent } from '../features/feature-products/featured-products.component';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { StoreRegion } from '@medusajs/types';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgOptimizedImage, HeroComponent, FeaturedProductsComponent],
  template: `
    <app-hero />
    <div class="py-12">
      <ul class="flex flex-col gap-x-6">
        @if(collections() && this.region()){
        <featured-products [collections]="collections()" [region]="region()" />
        }
      </ul>
    </div>
  `,
})
export default class HomeComponent {
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
