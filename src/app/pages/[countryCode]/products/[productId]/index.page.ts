import { injectLoad } from '@analogjs/router';
import { Component, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { load } from './index.server';
import { ProductDetailComponent } from '../../../../features/products/product-detail.component';

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [ProductDetailComponent],
  template: `
    <app-product-detail
      [product]="serverData().product"
      [region]="serverData().region"
      [countryCode]="serverData().countryCode"
    />
  `,
})
export default class ProductDetailPageComponent {
  // Use injectLoad to get data from server-side load function
  protected serverData = toSignal(injectLoad<typeof load>(), {
    requireSync: true,
  });

  constructor() {
    effect(() => {
      console.log(this.serverData());
    });
  }
}
