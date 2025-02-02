import { Component, computed, inject, input, OnInit } from '@angular/core';
import { HttpTypes } from '@medusajs/types';
import { MedusaService } from 'src/app/services/medusa.service';
import { ThumbnailComponent } from './thumbnail';
import { ProductPriceComponent } from './price.component';

@Component({
  selector: 'product-preview',
  standalone: true,
  imports: [ThumbnailComponent, ProductPriceComponent],
  template: ` <div class="min-h-[645px]">
    <product-thumbnail
      [thumbnail]="product()?.thumbnail || null"
      [images]="product()?.images || null"
    />
    <div class="flex mt-4 justify-between">
      <p class="text-accent-foreground z-10">
        {{ product()?.title }}
      </p>
      <div class="flex items-center gap-x-2">
        @if(cheapestPrice()){
        <product-price [price]="cheapestPrice()" />
        }
      </div>
    </div>
  </div>`,
})
export class ProductPreviewComponent {
  public readonly product = input<HttpTypes.StoreProduct>();
  #medusa = inject(MedusaService);

  // temp any
  cheapestPrice: any = computed(() => {
    console.log(this.product());
    const productPricing = this.product()
      ? this.#medusa.getProductPrice({
          product: this.product() || null,
        })
      : null;
    console.log(productPricing);
    return productPricing?.cheapestPrice ?? null;
  });
}
