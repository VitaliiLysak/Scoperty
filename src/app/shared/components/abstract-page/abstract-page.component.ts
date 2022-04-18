import { OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

export abstract class AbstractPageComponent implements OnInit, OnDestroy {

  protected _routerFragmentSubscription: Subscription = null;
  protected _anchorAliases: Map<string, string> = new Map();
  protected _url: string  = '/map';

  public _name: string = '_';

  protected _subscribeToAnchorChanged(): void {
    this._routerFragmentSubscription = this.actRoute.fragment
                                                    .subscribe(this._scrollToAnchor.bind(this));
  }

  protected _scrollToAnchor(anchor): void {
    if (anchor === 'main') {
      return void this.router.navigate([this._url], { queryParamsHandling: 'merge' });
    }
    if (this._anchorAliases.has(anchor)) {
      return void this.router.navigate(
        [this._url],
        {
          fragment: this._anchorAliases.get(anchor),
          queryParamsHandling: 'merge'
        },
      );
    }

    requestAnimationFrame(() => {
      const element = document.querySelector(`#${anchor}`);
      if (element) requestAnimationFrame(() => element.scrollIntoView(true));
    });
  }

  constructor(
    protected actRoute: ActivatedRoute,
    protected router: Router
  ) {}

  public ngOnInit(): void {
    this._subscribeToAnchorChanged();
  }

  public ngOnDestroy(): void {
    if (this._routerFragmentSubscription) {
      this._routerFragmentSubscription.unsubscribe();
    }
  }
}
