import { Component, Input } from '@angular/core';
import { HttpTypes } from '@medusajs/types';
import { ProductActionsComponent } from './product-actions.component';

@Component({
  selector: 'product-actions-wrapper',
  standalone: true,
  imports: [ProductActionsComponent],
  template: `
    <product-actions [product]="product" [region]="region"></product-actions>
  `,
})
export class ProductActionsWrapperComponent {
  @Input() id?: string;
  @Input() region?: HttpTypes.StoreRegion;

  // In a real implementation, this would fetch the product using the id
  product: any = {
    id: 'prod_123',
    title: 'Sample Product',
    description: 'This is a sample product description',
  };
}
