import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `<footer class="border-t border-primary w-full">
    <div class="container flex flex-col w-full">
      <div
        class="flex flex-col gap-y-6 sm:flex-row items-start justify-between py-40"
      >
        <div>
          <a
            class="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase"
            href="/us"
            >Medusa Store</a
          >
        </div>
        <div
          class="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3"
        >
          <div class="flex flex-col gap-y-2">
            <span class="txt-small-plus txt-ui-fg-base">Categories</span>
            <ul class="grid grid-cols-1 gap-2">
              <li class="flex flex-col gap-2 text-ui-fg-subtle txt-small">
                <a
                  class="hover:text-ui-fg-base txt-small-plus"
                  href="/us/categories/clothing"
                  >Clothing</a
                >
                <ul class="grid grid-cols-1 ml-3 gap-2">
                  <li>
                    <a
                      class="hover:text-ui-fg-base"
                      href="/us/categories/clothing/hoodies"
                      >Hoodies</a
                    >
                  </li>
                  <li>
                    <a
                      class="hover:text-ui-fg-base"
                      href="/us/categories/accessories"
                      >Accessories</a
                    >
                  </li>
                </ul>
              </li>
              <li class="flex flex-col gap-2 text-ui-fg-subtle txt-small">
                <a
                  class="hover:text-ui-fg-base txt-small-plus"
                  href="/us/categories/audio"
                  >Audio</a
                >
                <ul class="grid grid-cols-1 ml-3 gap-2"></ul>
              </li>
              <li class="flex flex-col gap-2 text-ui-fg-subtle txt-small">
                <a
                  class="hover:text-ui-fg-base txt-small-plus"
                  href="/us/categories/furniture"
                  >Furniture</a
                >
                <ul class="grid grid-cols-1 ml-3 gap-2"></ul>
              </li>
            </ul>
          </div>
          <div class="flex flex-col gap-y-2">
            <span class="txt-small-plus txt-ui-fg-base">Collections</span>
            <ul class="grid grid-cols-1 gap-2 text-ui-fg-subtle txt-small">
              <li>
                <a
                  class="hover:text-ui-fg-base"
                  href="/us/collections/latest-drops"
                  >Latest Drops</a
                >
              </li>
              <li>
                <a
                  class="hover:text-ui-fg-base"
                  href="/us/collections/weekly-picks"
                  >Weekly Picks</a
                >
              </li>
              <li>
                <a class="hover:text-ui-fg-base" href="/us/collections/sale"
                  >Sale</a
                >
              </li>
            </ul>
          </div>
          <div class="flex flex-col gap-y-2">
            <span class="txt-small-plus txt-ui-fg-base">Medusa</span>
            <ul class="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
              <li>
                <a
                  href="https://github.com/medusajs"
                  target="_blank"
                  rel="noreferrer"
                  class="hover:text-ui-fg-base"
                  >GitHub</a
                >
              </li>
              <li>
                <a
                  href="https://docs.medusajs.com"
                  target="_blank"
                  rel="noreferrer"
                  class="hover:text-ui-fg-base"
                  >Documentation</a
                >
              </li>
              <li>
                <a
                  href="https://github.com/medusajs/nextjs-starter-medusa"
                  target="_blank"
                  rel="noreferrer"
                  class="hover:text-ui-fg-base"
                  >Source code</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="flex w-full mb-16 justify-between text-muted">
        <p class="text-sm text-muted-foreground">
          &copy; {{ currentYear }} Medusa Store. All rights reserved.
        </p>
      </div>
    </div>
  </footer> `,
})
export class FooterComponent {
  protected readonly currentYear = new Date().getFullYear();
}
