import { JsonPipe } from '@angular/common';
import { Component, effect, input, OnInit } from '@angular/core';

@Component({
  selector: 'product-price',
  standalone: true,
  imports: [JsonPipe],
  template: ` {{ price | json }}

    @if(price()?.price_type === "sale"){
    <div class="line-through text-ui-fg-muted">
      {{ price()?.original_price }}
    </div>
    }
    <div>
      {{ price()?.calculated_price }}
    </div>`,
})
export class ProductPriceComponent {
  public readonly price = input<{
    calculated_price_number: any;
    calculated_price: string;
    original_price_number: any;
    original_price: string;
    currency_code: any;
    price_type: any;
    percentage_diff: string;
  } | null>(null);

  constructor() {
    effect(() => {
      console.log(this.price());
    });
  }
}
