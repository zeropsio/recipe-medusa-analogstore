import { Component, Input } from '@angular/core';
import { HttpTypes } from '@medusajs/types';

@Component({
  selector: 'product-tabs',
  standalone: true,
  template: `
    <div class="flex flex-col gap-y-6">
      <div class="flex items-center gap-x-6 border-b border-gray-200">
        <button class="text-sm py-2 border-b-2 border-gray-900">
          Description
        </button>
        <button class="text-sm py-2 text-gray-500">Shipping & Returns</button>
      </div>
      <div>
        <p class="text-sm text-gray-700">{{ product?.description }}</p>
      </div>
    </div>
  `,
})
export class ProductTabsComponent {
  @Input() product?: HttpTypes.StoreProduct;
}
