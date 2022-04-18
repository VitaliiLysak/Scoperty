import {
  Inject,
  Injectable,
} from '@angular/core';

import { NAVIGATOR } from './navigator.provider';

interface BrowserVersion {
  name: string;
  version: number;
}

@Injectable()
export class BrowserService {
  public get browserVersion(): BrowserVersion {
    const userAgent = this.navigator.userAgent;
    let userAgentMatches = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    let temporary: string[];

    if (/trident/i.test(userAgentMatches[1])) {
      temporary = /\brv[ :]+(\d+)/g.exec(userAgent) || [];

      return {
        name: 'IE',
        version: Number.parseInt(temporary[1], 10),
      };
    }

    if (userAgentMatches[1] === 'Chrome') {
      temporary = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
      if (temporary != null) {
        temporary = temporary.slice(1);

        return {
          name: temporary[0].replace('OPR', 'Opera'),
          version: Number.parseInt(temporary[1], 10),
        };
      }
    }

    userAgentMatches = userAgentMatches[2]
      ? [userAgentMatches[1], userAgentMatches[2]]
      : [this.navigator.appName, this.navigator.appVersion, '-?'];

    if ((temporary = userAgent.match(/version\/(\d+)/i)) != null) {
      userAgentMatches.splice(1, 1, temporary[1]);
    }

    return {
      name: userAgentMatches[0],
      version: Number.parseInt(userAgentMatches[1], 10),
    };
  }

  public get canIUseWebP(): boolean {
    const { name, version } = this.browserVersion;

    if (name === 'Firefox' && version >= 65) {
      return true;
    }

    if (name === 'Chrome' && version >= 23) {
      return true;
    }

    if (name === 'Opera' && version >= 13) {
      return true;
    }

    if (name === 'Edge' && version >= 18) {
      return true;
    }

    return false;
  }

  constructor(@Inject(NAVIGATOR) private navigator: Navigator) {}
}
