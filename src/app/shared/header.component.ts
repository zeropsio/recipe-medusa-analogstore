import { Component, OnInit } from '@angular/core';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import { HlmSheetModule } from '@spartan-ng/ui-sheet-helm';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [HlmSheetModule, HlmButtonDirective],
  template: `
    <div class="sticky top-0 inset-x-0 z-50 group">
      <header
        class="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base"
      >
        <nav
          class="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular"
        >
          <div class="flex-1 basis-0 h-full flex items-center">
            <div class="h-full">
              <div class="h-full">
                <div class="flex items-center h-full">
                  <div class="h-full flex">
                    <div class="relative flex h-full">
                      <hlm-sheet>
                        <button hlmBtn variant="ghost" variabrnSheetTrigger>
                          Menu
                        </button>
                        <hlm-sheet-content *brnSheetContent="let ctx">
                          <hlm-sheet-header>
                            <h3 hlmSheetTitle>Edit Profile</h3>
                            <p hlmSheetDescription>
                              Make changes to your profile here. Click save when
                              you're done.
                            </p>
                          </hlm-sheet-header>
                        </hlm-sheet-content>
                      </hlm-sheet>
                    </div>
                  </div>
                  <div
                    style="position:fixed;top:1px;left:1px;width:1px;height:0;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border-width:0;display:none"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center h-full">
            <a
              class="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
              href="/us"
              >Medusa Store</a
            >
          </div>
          <div
            class="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end"
          >
            <div class="hidden small:flex items-center gap-x-6 h-full">
              <a class="hover:text-ui-fg-base" href="/us/search">Search</a
              ><a class="hover:text-ui-fg-base" href="/us/account">Account</a>
            </div>
            <div class="h-full z-50">
              <div class="relative h-full">
                <a hlmBtn variant="ghost" href="/us/cart">Cart (0)</a>
              </div>
              <div
                style="position:fixed;top:1px;left:1px;width:1px;height:0;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border-width:0;display:none"
              ></div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  `,
})
export class HeaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
