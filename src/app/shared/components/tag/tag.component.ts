import {Component, Input} from '@angular/core';

type TagColor = 'light' | 'dark';
type TagSize = 'small' | 'regular';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: [
    './tag.component.css',
  ],
})
export class TagComponent {
  @Input() color: TagColor = 'dark';
  @Input() size: TagSize = 'regular';

  public _name = 'tag';
}
