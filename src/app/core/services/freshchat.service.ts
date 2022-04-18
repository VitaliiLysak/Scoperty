import { DOCUMENT } from '@angular/common';
import { Injectable, Inject } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FreshchatService {
  private get bodyElement(): HTMLBodyElement {
    return this.document.getElementsByTagName('body')[0];
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) { }

  public addFreshchat(): void {
    const scriptElement = this.createScriptElement(this.freshchatScript);
    this.bodyElement.appendChild(scriptElement);
  }

  private get freshchatScript(): string {
    return `window.fcWidget.init({
      token: "${environment.freshchatPixelToken}",
      host: "https://wchat.freshchat.com"});`;
  }

  private createScriptElement(script: string): HTMLScriptElement {
    const scriptElement = this.document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.async = true;
    scriptElement.innerHTML = script;

    return scriptElement;
  }
}
