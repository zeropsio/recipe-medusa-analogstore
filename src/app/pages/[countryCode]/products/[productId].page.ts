import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-product-detail-layout-page',
  standalone: true,
  imports: [RouterOutlet],
  template: ` <router-outlet /> `,
})
export default class ProductDetailLayoutPageComponent {}
