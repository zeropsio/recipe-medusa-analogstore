import { Component, input, Input } from '@angular/core';
import { HttpTypes } from '@medusajs/types';

@Component({
  selector: 'product-info',
  standalone: true,
  template: `
    <div class="flex flex-col gap-y-4">
      <h1 class="text-3xl font-bold">{{ product()?.title }}</h1>
      <p class="text-sm font-normal font-sans">{{ product()?.description }}</p>
    </div>
  `,
})
export class ProductInfoComponent {
  public product = input<HttpTypes.StoreProduct>();
}
