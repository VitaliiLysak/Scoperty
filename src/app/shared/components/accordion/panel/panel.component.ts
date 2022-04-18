import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { debounce } from 'lodash';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css']
})

export class PanelComponent implements OnInit {
  /**
   * Location prefix for QA Automation selectors
   */
  @Input() locationPrefix: string = '';
  /**
   * State of tab
   * opened = false - closed, opened = true - opened
  */
  @Input() opened: boolean = false;

  /**
   * Show or hide content inside tab.
   * If isLoaded = false it will show loader animation in container
  */
  @Input() isLoaded: boolean = false;

  /**
   * CSS height for content container.
   * Default 0px. You can redefine this behavior.
  */
  @Input() containerHeight: string = '0px';

  /**
   * Event for AccordionComponent.
   * AccordionComponent subscribes on this event and
   * can control opened and closed tabs.
  */
  @Output() toggle: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() scrolled: EventEmitter<boolean> = new EventEmitter<boolean>();

  public _name: string = 'panel';
  public ngOnInit(): void {
    this.scrollBlock = debounce(this.scrollBlock.bind(this), 1000);
  }

  /**
   * Emit Event Fn() for AccordionComponent.
   * AccordionComponent subscribes on this event and
   * can control opened and closed tabs.
  */
  public toggleBlock(): void {
    this.opened = !this.opened;

    this.toggle.emit(this.opened);
  }

  public scrollBlock(): void {
    this.scrolled.emit(true);
  }
}
