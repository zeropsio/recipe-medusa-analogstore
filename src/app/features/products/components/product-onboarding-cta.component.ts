import { Component } from '@angular/core';

@Component({
  selector: 'product-onboarding-cta',
  standalone: true,
  template: `
    <div class="flex flex-col gap-y-2">
      <span class="text-sm font-medium">Admin panel</span>
      <p class="text-xs text-gray-700">
        Manage your products, orders, customers, and more from the Medusa Admin.
      </p>
      <a
        href="https://admin.medusa-commerce.com"
        target="_blank"
        class="text-xs text-blue-600 underline"
      >
        Open admin panel
      </a>
    </div>
  `,
})
export class ProductOnboardingCtaComponent {}
