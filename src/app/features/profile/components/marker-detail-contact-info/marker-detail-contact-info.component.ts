import {
  Component,
  Input, Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-marker-detail-contact-info',
  templateUrl: './marker-detail-contact-info.component.html',
  styleUrls: ['./marker-detail-contact-info.component.css']
})
export class MarkerDetailContactInfoComponent {
  @Input() model: any = null;
  @Input() mode: 'edit'|'show' = 'show';

  @Output() changeProperty: EventEmitter<any> = new EventEmitter<any>();
  @Output() openContactMeForm: EventEmitter<Object> = new EventEmitter<Object>();

  public _name: string = 'marker-detail-contact-info';

  public contactMe() {
    this.openContactMeForm.emit();
  }

  public anyInputOnFocus({target}) {
    target.labels.forEach((item) => item.dataset.isFocused = '');
  }

  public alphaNumericValidate({target}) {
    // if (!/^[\w\d\s\.\,]*$/ig.test(target.value)) {
    //   target.value = target.dataset.prevval || '';
    // }
  }

  public zipValidate({target}) {
    if (!/^[\d]{0,5}$/ig.test(target.value)) {
      target.value = target.dataset.prevval || '';
    }
  }

  public anyInputOnKeydown = (e) => {
    const {keyCode, target} = e;
    target.dataset.prevval = target.value;
  }

  public savePropertyInput({target}, key) {
    target.labels.forEach((item) => delete item.dataset.isFocused);
    const {value} = target;
    this.changeProperty.emit({key, value});
  }

  public savePropertyBoolean(value, key) {
    this.changeProperty.emit({key, value});
  }
}
