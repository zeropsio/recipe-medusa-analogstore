import { Component, inject, input, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HttpTypes } from '@medusajs/types';
import { MedusaService } from 'src/app/services/medusa.service';
import { ProductPreviewComponent } from '../products/product-preview.component';

@Component({
  selector: 'product-rail',
  standalone: true,
  imports: [ProductPreviewComponent],
  template: ` <div class="content-container py-12 small:py-24">
    <div class="flex justify-between mb-8">
      <h2 class="txt-xlarge">{{ collection()?.title }}</h2>
      <a href="">View all</a>
    </div>
    <ul
      class="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-24 small:gap-y-36"
    >
      @for(product of products(); track product.id){
      <li>
        <product-preview [product]="product" />
      </li>
      }
    </ul>
  </div>`,
})
export class ProductRailComponent {
  #medusa = inject(MedusaService);
  products = toSignal(this.#medusa.productList$());

  public collection = input<HttpTypes.StoreCollection | undefined>();
  public region = input.required<HttpTypes.StoreRegion | null | undefined>();
}
