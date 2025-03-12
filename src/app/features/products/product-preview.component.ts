import { Component, computed, inject, input } from '@angular/core';
import { HttpTypes } from '@medusajs/types';
import { MedusaService } from 'src/app/services/medusa.service';
import { ThumbnailComponent } from './thumbnail';
import { ProductPriceComponent } from './price.component';
import { HlmCardModule } from '@spartan-ng/ui-card-helm';
import { RouterLink } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'product-preview',
  standalone: true,
  imports: [
    ThumbnailComponent,
    ProductPriceComponent,
    HlmCardModule,
    RouterLink,
  ],
  template: ` <a
    [routerLink]="productLink()"
    class="block cursor-pointer hover:opacity-90 transition-opacity"
  >
    <div hlmCard>
      <div hlmCardContent class="p-0">
        <product-thumbnail
          [thumbnail]="product()?.thumbnail || null"
          [images]="product()?.images || null"
        />
      </div>
    </div>
    <div class="flex mt-4 justify-between">
      <p class="text-accent-foreground z-10">
        {{ product()?.title }}
      </p>
      <div class="flex items-center gap-x-2">
        @if(cheapestPrice()){
        <product-price [price]="cheapestPrice()" />
        }
      </div>
    </div>
  </a>`,
})
export class ProductPreviewComponent {
  public readonly product = input<HttpTypes.StoreProduct>();

  readonly #medusa = inject(MedusaService);
  readonly #route = inject(ActivatedRoute);

  protected countryCode = toSignal(
    this.#route.params.pipe(map((params) => params['countryCode'])),
    {
      initialValue: '',
    }
  );

  protected cheapestPrice: any = computed(() => {
    const product = this.product();
    if (!product) {
      return null;
    }

    const productPrice = this.#medusa.getProductPrice({
      product,
    });

    return productPrice?.cheapestPrice ?? null;
  });

  // Generate the product link
  protected productLink = computed(() => {
    if (!this.product()) {
      return '';
    }

    // Create URL-friendly handle from product title
    const handle =
      this.product()?.handle ||
      this.product()?.title?.toLowerCase().replace(/\s+/g, '-') ||
      this.product()?.id;
    console.log(`/${this.countryCode()}/products/${handle}`);
    return `/${this.countryCode()}/products/${handle}`;
  });
}
