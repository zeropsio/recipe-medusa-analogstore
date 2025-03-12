import { Component, input, OnInit } from '@angular/core';
import { HttpTypes } from '@medusajs/types';

@Component({
  selector: 'product-information',
  standalone: true,
  template: `<div class="text-small-regular py-8">
    <div class="grid grid-cols-2 gap-x-8">
      <div class="flex flex-col gap-y-4">
        <div>
          <span class="font-semibold">Material</span>
          <p>{{ product()?.material ?? '-' }}</p>
        </div>
        <div>
          <span class="font-semibold">Country of origin</span>
          <p>{{ product()?.origin_country ?? '-' }}</p>
        </div>
        <div>
          <span class="font-semibold">Type</span>
          <p>{{ product()?.type ?? '-' }}</p>
        </div>
      </div>
      <div class="flex flex-col gap-y-4">
        <div>
          <span class="font-semibold">Weight</span>
          <p>{{ product()?.weight ? product()?.weight + ' g' : '-' }}</p>
        </div>
        <div>
          <span class="font-semibold">Dimensions</span>
          <p>
            {{
              product()?.length && product()?.width && product()?.height
                ? product()?.length +
                  'L x ' +
                  product()?.width +
                  'W x ' +
                  product()?.height +
                  'H'
                : '-'
            }}
          </p>
        </div>
      </div>
    </div>
  </div>`,
})
export class ProductInfoComponent {
  public product = input<HttpTypes.StoreProduct>();
}
