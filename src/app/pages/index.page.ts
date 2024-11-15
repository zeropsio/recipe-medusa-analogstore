import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MedusaService } from '../services/medusa.service';
import { NgOptimizedImage } from '@angular/common'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  template: `

    <h1 class="text-3xl font-bold text-white-900 pb-4">Analog.js x Spartan x Medusa.js x Zerops.io</h1>

    @for (item of products()?.products; track item.id) {
      <div class="mb-6">

        <h3 class="text-xl font-semibold text-white-800 mb-2">{{ item.title }}</h3>

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
    }

  `,
  styles: `

  `,
})
export default class HomeComponent {
  #medusa = inject(MedusaService);
  products = toSignal(this.#medusa.productList$());

}
