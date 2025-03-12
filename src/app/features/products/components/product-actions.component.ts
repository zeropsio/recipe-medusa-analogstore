import { Component, Input } from '@angular/core';
import { HttpTypes } from '@medusajs/types';

@Component({
  selector: 'product-actions',
  standalone: true,
  template: `
    <div class="flex flex-col gap-y-4">
      <h3 class="text-xl font-bold">{{ product?.title }}</h3>
      <div class="flex items-center gap-x-2">
        <span class="text-gray-500 line-through" *ngIf="discountPrice">{{
          originalPrice
        }}</span>
        <span class="text-xl font-semibold">{{ currentPrice }}</span>
      </div>
      <button
        class="w-full bg-black text-white py-2 rounded-md"
        [disabled]="disabled"
      >
        Add to cart
      </button>
    </div>
  `,
})
export class ProductActionsComponent {
  @Input() product?: HttpTypes.StoreProduct;
  @Input() region?: HttpTypes.StoreRegion;
  @Input() disabled = false;

  get originalPrice(): string {
    return '$99.00';
  }

  get currentPrice(): string {
    return '$79.00';
  }

  get discountPrice(): boolean {
    return true;
  }
}
