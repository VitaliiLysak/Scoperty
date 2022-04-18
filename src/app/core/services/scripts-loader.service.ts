import { Injectable } from '@angular/core';

import { intersection } from 'lodash';

import { CookiesService } from './cookies.service';
import { environment } from '../../../environments/environment';

interface IEHTMLScriptElement extends HTMLScriptElement {
  readyState: string;
  onreadystatechange: () => any;
}

function isIEHTMLScriptElement(element: HTMLScriptElement): element is IEHTMLScriptElement {
  return !!(element as any).readyState;
}

@Injectable()
export class ScriptsLoaderService {

  private scripts: {[name: string]: {src: string, loaded?: boolean}} = {
    'vwo_pixel': {src: 'assets/scripts/vwo_pixel.js'},
  };

  constructor() {
    Object.keys(this.scripts)
      .forEach(name => {
        this.scripts[name].loaded = false;
      });
  }

  loadCookieDependentEnvScripts() {
    if (!Array.isArray(environment.featureFlags)) {
      return;
    }

    this.load(...intersection(Object.keys(this.scripts), environment.featureFlags));
  }

  // load a single or multiple scripts
  private load(...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  private loadScript(name: string) {
    return new Promise((resolve, reject) => {
      if (this.scripts[name].loaded) {
        resolve({script: name, loaded: true, status: 'Already Loaded'});
      } else {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        if (isIEHTMLScriptElement(script)) {  // IE
          script.onreadystatechange = () => {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
              script.onreadystatechange = null;
              this.scripts[name].loaded = true;
              resolve({script: name, loaded: true, status: 'Loaded'});
            }
          };
        } else {
          script.onload = () => {
            this.scripts[name].loaded = true;
            resolve({script: name, loaded: true, status: 'Loaded'});
          };
        }
        script.onerror = (error: any) => resolve({script: name, loaded: false, status: 'Loaded'});
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    });
  }
}
