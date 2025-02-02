import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MedusaService } from '../../services/medusa.service';
import { NgOptimizedImage } from '@angular/common';
import { HeroComponent } from '../../shared/hero.component';

@Component({
  selector: 'app-country-code',
  standalone: true,
  imports: [NgOptimizedImage, HeroComponent],
  template: `
    <!-- <app-hero /> -->

    <!-- @for (item of products()?.products; track item.id) {
    <div class="mb-6">
      <h3 class="text-xl font-semibold text-white-800 mb-2">
        {{ item.title }}
      </h3>

      @if (item.thumbnail) {
      <img
        [ngSrc]="item.thumbnail"
        [alt]="item.title"
        [width]="600"
        [height]="600"
        class="rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
      />
      }
    </div>
    } -->
  `,
})
export default class CountryCodeComponent {
  //   #medusa = inject(MedusaService);
  //   products = toSignal(this.#medusa.productList$());
}
