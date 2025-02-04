import { NgOptimizedImage } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { HlmAspectRatioModule } from '@spartan-ng/ui-aspectratio-helm';

@Component({
  selector: 'product-thumbnail',
  standalone: true,
  imports: [NgOptimizedImage, HlmAspectRatioModule],
  template: ` <div
    class="rounded-lg relative overflow-hidden p-4 rounded-large group-hover:shadow-elevation-card-hover transition-shadow ease-in-out duration-150 aspect-[11/14] w-full"
  >
    @if(imageSrc()){
    <img
      [ngSrc]="imageSrc()"
      width="400"
      height="500"
      alt="Thumbnail"
      class="absolute inset-0 object-cover object-center w-full h-full"
    />
    } @else {
    <div
      class="w-full h-full absolute inset-0 flex items-center justify-center"
    >
      <svg
        width="{size}"
        height="{size}"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...attributes}
      >
        <path
          d="M15.3141 3.16699H4.68453C3.84588 3.16699 3.16602 3.84685 3.16602 4.6855V15.3151C3.16602 16.1537 3.84588 16.8336 4.68453 16.8336H15.3141C16.1527 16.8336 16.8326 16.1537 16.8326 15.3151V4.6855C16.8326 3.84685 16.1527 3.16699 15.3141 3.16699Z"
          stroke="{color}"
          strokeWidth="1.53749"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.91699 9.16699C8.60735 9.16699 9.16699 8.60735 9.16699 7.91699C9.16699 7.22664 8.60735 6.66699 7.91699 6.66699C7.22664 6.66699 6.66699 7.22664 6.66699 7.91699C6.66699 8.60735 7.22664 9.16699 7.91699 9.16699Z"
          stroke="{color}"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16.6667 12.5756L13.0208 9.1665L5 16.6665"
          stroke="{color}"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    }
  </div>`,
})
export class ThumbnailComponent {
  public readonly images = input<any[] | null>(null);
  public readonly thumbnail = input<string | null>(null);
  protected readonly imageSrc = computed(
    () => this.thumbnail() || this.images()?.[0]?.url
  );
  public readonly size = input<'small' | 'large'>('small');
}
