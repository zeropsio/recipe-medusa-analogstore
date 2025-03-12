import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'skeleton-related-products',
  standalone: true,
  imports: [NgFor],
  template: `
    <div class="py-12">
      <div class="h-6 w-32 bg-gray-200 animate-pulse rounded-md mb-6"></div>
      <div class="grid grid-cols-2 small:grid-cols-4 gap-4">
        <div *ngFor="let i of [1, 2, 3, 4]" class="flex flex-col gap-y-2">
          <div class="aspect-square bg-gray-200 animate-pulse rounded-md"></div>
          <div class="h-4 w-3/4 bg-gray-200 animate-pulse rounded-md"></div>
          <div class="h-4 w-1/2 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
      </div>
    </div>
  `,
})
export class SkeletonRelatedProductsComponent {}
