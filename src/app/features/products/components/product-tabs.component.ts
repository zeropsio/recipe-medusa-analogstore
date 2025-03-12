import { Component, input, Input } from '@angular/core';
import { HttpTypes } from '@medusajs/types';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideMinus, lucidePlus } from '@ng-icons/lucide';
import { HlmAccordionDirective } from '@spartan-ng/ui-accordion-helm';
import {
  HlmAccordionItemDirective,
  HlmAccordionTriggerDirective,
} from '@spartan-ng/ui-accordion-helm';
import { HlmAccordionContentComponent } from '@spartan-ng/ui-accordion-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import { ProductShippingInfoComponent } from './product-details/product-shipping-info.component';
import { ProductInfoComponent } from './product-details/product-info.component';
@Component({
  selector: 'product-tabs',
  standalone: true,
  imports: [
    HlmAccordionDirective,
    HlmAccordionItemDirective,
    HlmAccordionTriggerDirective,
    HlmAccordionContentComponent,
    HlmIconDirective,
    NgIconComponent,
    ProductShippingInfoComponent,
    ProductInfoComponent,
  ],
  viewProviders: [provideIcons({ lucidePlus, lucideMinus })],
  template: `
    <div hlmAccordion>
      <div hlmAccordionItem>
        <button hlmAccordionTrigger>
          Description
          <ng-icon name="lucidePlus" hlm hlmAccIcon />
        </button>
        <hlm-accordion-content ngSkipHydration>
          <product-information [product]="product()" />
        </hlm-accordion-content>
      </div>

      <div hlmAccordionItem>
        <button hlmAccordionTrigger>
          Shipping & Returns
          <ng-icon name="lucidePlus" hlm hlmAccIcon />
        </button>
        <hlm-accordion-content ngSkipHydration>
          <product-shipping-info />
        </hlm-accordion-content>
      </div>
    </div>
  `,
})
export class ProductTabsComponent {
  public product = input<HttpTypes.StoreProduct>();
}
