import { Component, OnInit } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideBell, lucideGithub } from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmIconDirective } from '@spartan-ng/ui-icon-helm';
import {
  hlmBlockquote,
  hlmH1,
  hlmH2,
  hlmH3,
  hlmLead,
  hlmP,
  hlmUl,
} from '@spartan-ng/ui-typography-helm';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [HlmButtonDirective, NgIcon, HlmIconDirective],
  providers: [provideIcons({ lucideGithub, lucideBell })],
  host: {
    class: 'block h-[75vh] w-full border-b relative ',
  },
  template: ` <div
    class="bg-muted text-foreground absolute inset-0 z-10 flex flex-col justify-center items-center text-center sm:p-32 gap-6"
  >
    <span>
      <h1 class="${hlmH2} border-b-0">Ecommerce Starter Template</h1>
      <h2 class="${hlmH3} text-muted-foreground">
        Powered by Analog.js x Spartan x Medusa.js x Zerops.io
      </h2>
    </span>
    <a
      href="https://github.com/medusajs/nextjs-starter-medusa"
      target="_blank"
      hlmBtn
      class="gap-1.5"
    >
      View on GitHub
      <ng-icon hlm size="sm" name="lucideGithub" />
    </a>
  </div>`,
})
export class HeroComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
