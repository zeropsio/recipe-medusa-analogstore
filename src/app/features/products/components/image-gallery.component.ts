import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

interface ProductImage {
  id: string;
  url: string;
}

@Component({
  selector: 'image-gallery',
  standalone: true,
  template: `
    <div class="flex flex-col gap-y-4 sm:mx-16">
      <div class="w-full aspect-square relative ">
        @if(images && images.length > 0){
        <img
          [src]="selectedImage?.url || images[0]?.url"
          alt="Product image"
          class="w-full h-full object-cover rounded-lg"
        />
        }
      </div>
      <!-- <div class="flex gap-x-2 overflow-x-auto">
        <div
          *ngFor="let image of images"
          class="w-24 h-24 relative cursor-pointer"
          (click)="selectImage(image)"
        >
          <img
            [src]="image.url"
            alt="Thumbnail"
            class="w-full h-full object-cover rounded-md"
            [class.border-2]="selectedImage?.id === image.id"
            [class.border-black]="selectedImage?.id === image.id"
          />
        </div>
      </div> -->
    </div>
  `,
})
export class ImageGalleryComponent {
  @Input() images: ProductImage[] = [];
  selectedImage?: ProductImage;

  selectImage(image: ProductImage): void {
    this.selectedImage = image;
  }
}
