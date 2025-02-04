import { Component, inject, input, OnInit, signal } from '@angular/core';
import { HttpTypes } from '@medusajs/types';
import { MedusaService } from 'src/app/services/medusa.service';
import { ProductPreviewComponent } from '../products/product-preview.component';

@Component({
  selector: 'product-rail',
  standalone: true,
  imports: [ProductPreviewComponent],
  template: ` <div class="container py-12 sm:py-24">
    <div class="flex justify-between mb-8">
      <h2 class="txt-xlarge">{{ collection()?.title }}</h2>
      <a href="">View all</a>
    </div>
    <ul
      class="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-24 small:gap-y-36"
    >
      @for(product of products(); track product?.['id']){
      <li>
        <product-preview [product]="product" />
      </li>
      }
    </ul>
  </div>`,
})
export class ProductRailComponent implements OnInit {
  #medusa = inject(MedusaService);
  products = signal<HttpTypes.StoreProduct[]>([]);

  public collection = input<HttpTypes.StoreCollection | undefined>();
  public region = input.required<HttpTypes.StoreRegion | null | undefined>();

  async ngOnInit(): Promise<void> {
    const {
      response: { products },
    } = await this.#medusa.productList({
      regionId: this.region()?.id || 'US',
    });
    this.products.set(products);
  }
}
