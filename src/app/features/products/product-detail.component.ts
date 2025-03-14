import { Component, effect, input } from '@angular/core';
import { HttpTypes } from '@medusajs/types';

// Import all the components we created
import { ProductInfoComponent } from './components/product-info.component';
import { ProductTabsComponent } from './components/product-tabs.component';
import { ImageGalleryComponent } from './components/image-gallery.component';
import { ProductOnboardingCtaComponent } from './components/product-onboarding-cta.component';
import { ProductActionsComponent } from './components/product-actions.component';
import { ProductActionsWrapperComponent } from './components/product-actions-wrapper.component';
import { RelatedProductsComponent } from './components/related-products.component';
import { SkeletonRelatedProductsComponent } from './components/skeleton-related-products.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    ProductInfoComponent,
    ProductTabsComponent,
    ImageGalleryComponent,
    ProductOnboardingCtaComponent,
    ProductActionsComponent,
    ProductActionsWrapperComponent,
    RelatedProductsComponent,
    SkeletonRelatedProductsComponent,
  ],
  template: `
    <div
      class="container flex flex-col sm:flex-row sm:items-start py-6 relative"
      data-testid="product-container"
    >
      <div
        class="flex flex-col sm:sticky sm:top-48 sm:py-0 sm:max-w-[300px] w-full py-8 gap-y-6"
      >
        <product-info [product]="product()" />
        <product-tabs [product]="product()" />
      </div>
      <div class="block w-full relative">
        <image-gallery [images]="product()?.images || []" />
      </div>
      <div
        class="flex flex-col sm:sticky sm:top-48 sm:py-0 sm:max-w-[300px] w-full py-8 gap-y-12"
      >
        <product-onboarding-cta />

        @if(isLoading){
        <product-actions
          [disabled]="true"
          [product]="product()"
          [region]="region()"
        />
        } @else {
        <product-actions-wrapper [id]="product()?.id" [region]="region()" />
        }
      </div>
    </div>
    <!-- <div class="container py-12" data-testid="related-products-container">
      @if(isLoadingRelated){
      <skeleton-related-products />
      } @else {
      <related-products [product]="product()" [countryCode]="countryCode()" />
      }
    </div> -->
  `,
})
export class ProductDetailComponent {
  public product = input<HttpTypes.StoreProduct>();
  public region = input<HttpTypes.StoreRegion>();
  public countryCode = input<string>();

  isLoading = true;
  isLoadingRelated = true;
}
