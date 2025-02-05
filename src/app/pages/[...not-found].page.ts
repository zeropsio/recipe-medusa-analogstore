import { RouteMeta } from '@analogjs/router';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { hlmH3, hlmMuted } from '@spartan-ng/ui-typography-helm';

export const routeMeta: RouteMeta = {
  title: 'Medusa Store - Page not found',
};

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [HlmButtonDirective, RouterLink],
  host: {
    class:
      'flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]',
  },
  template: `<h1 class="${hlmH3} text-2xl-semi text-ui-fg-base">
      Page not found
    </h1>
    <p class="text-small-regular text-ui-fg-base">
      The page you tried to access does not exist.
    </p>
    <a
      routerLink="/"
      size="sm"
      class="${hlmMuted} text-xs"
      hlmBtn
      variant="link"
    >
      Back home
    </a> `,
})
export default class NotFoundComponent {}
