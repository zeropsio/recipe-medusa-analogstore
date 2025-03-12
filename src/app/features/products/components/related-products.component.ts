import { Component, Input } from '@angular/core';
import { HttpTypes } from '@medusajs/types';
import { NgFor } from '@angular/common';

@Component({
  selector: 'related-products',
  standalone: true,
  imports: [NgFor],
  template: `
    <div class="py-12">
      <h2 class="text-xl font-bold mb-6">Related Products</h2>
      <div class="grid grid-cols-2 small:grid-cols-4 gap-4">
        <div
          *ngFor="let relatedProduct of relatedProducts"
          class="flex flex-col gap-y-2"
        >
          <div class="aspect-square bg-gray-100 rounded-md">
            <img
              *ngIf="relatedProduct.thumbnail"
              [src]="relatedProduct.thumbnail"
              alt="Related product"
              class="w-full h-full object-cover rounded-md"
            />
          </div>
          <span class="text-sm font-medium">{{ relatedProduct.title }}</span>
          <span class="text-sm text-gray-500">{{ relatedProduct.price }}</span>
        </div>
      </div>
    </div>
  `,
})
export class RelatedProductsComponent {
  @Input() product?: HttpTypes.StoreProduct;
  @Input() countryCode?: string;

  // Mock data for related products
  relatedProducts = [
    {
      id: '1',
      title: 'Related Product 1',
      price: '$59.00',
      thumbnail: 'https://via.placeholder.com/150',
    },
    {
      id: '2',
      title: 'Related Product 2',
      price: '$69.00',
      thumbnail: 'https://via.placeholder.com/150',
    },
    {
      id: '3',
      title: 'Related Product 3',
      price: '$79.00',
      thumbnail: 'https://via.placeholder.com/150',
    },
    {
      id: '4',
      title: 'Related Product 4',
      price: '$89.00',
      thumbnail: 'https://via.placeholder.com/150',
    },
  ];
}
