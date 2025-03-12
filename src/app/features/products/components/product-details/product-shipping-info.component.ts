import { Component } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  lucidePackage,
  lucideRefreshCw,
  lucideRotateCcw,
} from '@ng-icons/lucide';

@Component({
  selector: 'product-shipping-info',
  standalone: true,
  imports: [NgIconComponent],
  viewProviders: [
    provideIcons({ lucidePackage, lucideRefreshCw, lucideRotateCcw }),
  ],
  template: ` <div class="text-small-regular py-8">
    <div class="grid grid-cols-1 gap-y-8">
      <div class="flex items-start gap-x-2">
        <div class="w-4 h-4 pt-1">
          <ng-icon name="lucidePackage" />
        </div>
        <div>
          <span class="font-semibold">Fast delivery</span>
          <p class="max-w-sm">
            Your package will arrive in 3-5 business days at your pick up
            location or in the comfort of your home.
          </p>
        </div>
      </div>
      <div class="flex items-start gap-x-2">
        <div class="w-4 h-4 pt-1">
          <ng-icon name="lucideRefreshCw" />
        </div>
        <div>
          <span class="font-semibold">Simple exchanges</span>
          <p class="max-w-sm">
            Is the fit not quite right? No worries - we&apos;ll exchange your
            product for a new one.
          </p>
        </div>
      </div>
      <div class="flex items-start gap-x-2">
        <div class="w-4 h-4 pt-1">
          <ng-icon name="lucideRotateCcw" />
        </div>
        <div>
          <span class="font-semibold">Easy returns</span>
          <p class="max-w-sm">
            Just return your product and we&apos;ll refund your money. No
            questions asked – we&apos;ll do our best to make sure your return is
            hassle-free.
          </p>
        </div>
      </div>
    </div>
  </div>`,
})
export class ProductShippingInfoComponent {}
