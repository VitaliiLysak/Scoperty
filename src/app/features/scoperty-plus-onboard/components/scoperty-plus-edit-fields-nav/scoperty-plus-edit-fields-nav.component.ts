import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-scoperty-plus-edit-fields-nav',
  templateUrl: './scoperty-plus-edit-fields-nav.component.html',
  styleUrls: ['./scoperty-plus-edit-fields-nav.component.css']
})
export class ScopertyPlusEditFieldsNavComponent implements OnInit {
  @Input() editable: boolean = true;
  @Input() mobile: boolean = true;
  @Input() hidden: boolean;
  @Output() sectionRewind = new EventEmitter<string>();

  sections: {[key: string]: ScopertyPlusEditFieldsNavComponent.Element[]} = {};

  get sectionNames() {
    return Object.keys(this.sections).sort();
  }

  constructor() { }

  ngOnInit() {
  }

  isEditable(element: ScopertyPlusEditFieldsNavComponent.Element) {
    return this.editable && !element.disabled;
  }

  pushSection(name: string, elements: ScopertyPlusEditFieldsNavComponent.Element[]) {
    this.sections[name] = elements;
  }

  rewindSection(sectionName: string) {
    this.sectionRewind.emit(sectionName);
  }
}

export namespace ScopertyPlusEditFieldsNavComponent {
  export interface Element {
    name: string;
    data: string;
    disabled?: boolean;
  }
}
