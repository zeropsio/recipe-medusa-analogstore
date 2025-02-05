import { Component, computed, inject, input, OnInit } from '@angular/core';
import { HttpTypes } from '@medusajs/types';
import { MedusaService } from 'src/app/services/medusa.service';
import { ThumbnailComponent } from './thumbnail';
import { ProductPriceComponent } from './price.component';
import { HlmCardModule } from '@spartan-ng/ui-card-helm';

@Component({
  selector: 'product-preview',
  standalone: true,
  imports: [ThumbnailComponent, ProductPriceComponent, HlmCardModule],
  template: ` <div class="" hlmCard>
      <div hlmCardContent class="p-0">
        <product-thumbnail
          [thumbnail]="product()?.thumbnail || null"
          [images]="product()?.images || null"
        />
      </div>
    </div>
    <div class="flex mt-4 justify-between">
      <p class="text-accent-foreground z-10">
        {{ product()?.title }}
      </p>
      <div class="flex items-center gap-x-2">
        @if(cheapestPrice()){
        <product-price [price]="cheapestPrice()" />
        }
      </div>
    </div>`,
})
export class ProductPreviewComponent {
  public readonly product = input<HttpTypes.StoreProduct>();
  #medusa = inject(MedusaService);

  // temp any
  cheapestPrice: any = computed(() => {
    const productPricing = this.product()
      ? this.#medusa.getProductPrice({
          product: this.product() || null,
        })
      : null;
    return productPricing?.cheapestPrice ?? null;
  });
}
