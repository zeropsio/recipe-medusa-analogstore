import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-country-code',
  standalone: true,
  imports: [RouterOutlet],
  template: ` <router-outlet /> `,
})
export default class CountryCodeComponent {}
