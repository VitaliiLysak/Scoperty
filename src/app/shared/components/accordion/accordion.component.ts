import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  OnDestroy,
  Input,
  HostBinding,
} from '@angular/core';

import { Subscription } from 'rxjs';

import { PanelComponent } from './panel/panel.component';

export enum VerticalAlignment {
  Top = 'column',
  Bottom = 'column-reverse'
}

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css']
})

export class AccordionComponent implements AfterContentInit, OnDestroy  {
  @ContentChildren(PanelComponent) panels: QueryList<PanelComponent>;

  @Input()
  @HostBinding('style.flex-direction')
  verticalAlignment: VerticalAlignment;

  private panelsSubscription: Subscription[] = [];

  public _name: string = 'accordion';

  /**
   * Handler.
   * @param panel: PanelComponent
   */
  private openPanel(panel: PanelComponent): void {
    // close all panels
    this.panels.toArray().forEach(p => p.opened = false);
    // open the selected panel
    panel.opened = true;
  }
  /**
   * Unsubscribe from all Observers.
   */
  public ngOnDestroy(): void {
    this.panelsSubscription.forEach(subscription => subscription.unsubscribe());
  }

  /**
   * Toggle panels after panels will be initialized
   * and set first panel opened.
   */
  public ngAfterContentInit(): void {
    this.panels.toArray().forEach((panel) => {
      // subscribe panel toggle event
      const panelSubscription: Subscription = panel.toggle.subscribe(event => {
        this.openPanel(panel);
      });
      // Collect subscriptions
      this.panelsSubscription.push(panelSubscription);
    });
  }
}
