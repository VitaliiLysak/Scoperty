import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  DomSanitizer,
  SafeResourceUrl,
} from '@angular/platform-browser';

import { LOGGER } from '../../../../core/services/logger/logger.provider';
import { LoggerService } from '../../../../core/services/logger/logger.service';
import { WINDOW } from '../../../../core/services/window.provider';
import { isString } from '../../../../shared/utils/is-string.util';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';

interface IE9Window extends Window {
  attachEvent?(type: string, listener: (event: any) => void): void;
}

const FRAME_ORIGIN = 'https://www.interhyp.de';
const FRAME_SRC_BASE = 'https://www.interhyp.de/angular/lafpartner/interest-calculator/';
const FRAME_SRC_PARAMETERS: { [ parameter: string ]: string } = {
  'LAF_PARTNER': 'SCOPERTY_ONLINE',
  'STYLE': 'CUSTOM',
  'COLOR': '07B09F',
  'adChannel': 'scoperty',
  'adCampaign': 'rechner',
  'adKeyword': 'zins',
};

@Component({
  selector: 'app-broker-interest-check',
  templateUrl: './broker-interest-check.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [
    './broker-interest-check.component.css',
  ],
})
export class BrokerInterestCheckComponent implements OnInit {
  @ViewChild('calculatorFrame')
  calculatorFrame: ElementRef;

  public _name: string = 'broker-interest-check';

  public frameSrc: SafeResourceUrl = this.createFrameSrc();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window,
    @Inject(LOGGER) private logger: LoggerService,
    private renderer: Renderer2,
    private domSanitizer: DomSanitizer,
  ) {
  }

  public ngOnInit(): void {
    this.listenForFrameMessages();
  }

  private listenForFrameMessages(): void {
    const window: IE9Window = this.window;
    if (window.addEventListener) {
      // all browsers except IE before version 9
      window.addEventListener('message', event => this.handleFrameMessageEvent(event), false);
    } else if (window.attachEvent)  {
      // IE before version 9
      window.attachEvent('onmessage', event => this.handleFrameMessageEvent(event));
    }
  }

  private handleFrameMessageEvent(event: MessageEvent): void {
    if (!this.isFrameMessageEvent(event)) {
      return;
    }

    this.applyHeightToFrame(event.data);
  }

  private isFrameMessageEvent(event: MessageEvent): boolean {
    return event.origin === FRAME_ORIGIN && isString(event.data);
  }

  private applyHeightToFrame(data: string): void {
    const hasData = data && data.length > 0;
    if (isNullOrUndefined(this.calculatorFrame) || !hasData) {
      return;
    }

    const frameHeight = `${ data.split('|||')[0] }px`;
    const frameElement: HTMLElement = this.calculatorFrame.nativeElement;
    this.renderer.setProperty(frameElement, 'height', frameHeight);
    this.renderer.setStyle(frameElement, 'min-height', '0');
    this.logger.info('BrokerInterestCheckComponent::frameHeight', frameHeight);
  }

  private createFrameSrc(): SafeResourceUrl {
    const parameters = Object.entries(FRAME_SRC_PARAMETERS)
      .map(([ parameter, value ]) => {
        return `${ parameter }=${ value }`;
      });
    const frameSrc = `${ FRAME_SRC_BASE }?${ parameters.join('&') }`;
    return this.domSanitizer.bypassSecurityTrustResourceUrl(frameSrc);
  }
}
