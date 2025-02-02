import { Component, computed, effect, input } from '@angular/core';
import { ProductRailComponent } from './product-rail.component';
import { HttpTypes } from '@medusajs/types';

@Component({
  selector: 'featured-products',
  standalone: true,
  imports: [ProductRailComponent],
  template: `
    @for(collection of _collections(); track collection.id ){
    <li>
      <product-rail [collection]="collection" [region]="region()" />
    </li>
    }
  `,
})
export class FeaturedProductsComponent {
  public collections = input<
    | {
        collections: HttpTypes.StoreCollection[];
        count: number;
      }
    | undefined
  >();

  protected _collections = computed(() => this.collections()?.collections);
  public region = input.required<HttpTypes.StoreRegion | null | undefined>();

  constructor() {
    effect(() => {
      console.log(this._collections());
    });
  }
}
