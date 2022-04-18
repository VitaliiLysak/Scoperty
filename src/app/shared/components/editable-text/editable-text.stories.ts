import {
  storiesOf,
  moduleMetadata,
} from '@storybook/angular';

import {
  CommonModule,
  CurrencyPipe, registerLocaleData,
} from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import localeDe from '@angular/common/locales/de';

import { TextMaskModule } from 'angular2-text-mask';

import { PipesModule } from '../../pipes/pipes.module';
import { AMOUNT_INPUT_MASK } from '../../utils/amount-input-mask.util';
import { cleanFormattedAmountString } from '../../utils/string.util';
import { toNumber } from '../../utils/to-number.util';
import { TransformControlValueValidators } from '../../validators/transform-control-value.validator';
import {
  AppLocaleProvider,
  GERMAN_LOCALE,
} from '../../../app-locale.provider';

import { EditableTextComponent } from './editable-text.component';

const MODULE_METADATA = moduleMetadata({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    TextMaskModule,

    PipesModule,
  ],
  providers: [
    AppLocaleProvider,
    CurrencyPipe,
  ],
  declarations: [
    EditableTextComponent,
  ],
});

const MIN_SELLING_PRICE = 1;
const MAX_SELLING_PRICE = 1000 * 1000 * 1000;

const SELLING_PRICE_ERROR_MESSAGES: { [ error: string ]: string } = {
  required: 'Kaufpreis ist ein Pflichtfeld',
  min: 'Kaufpreis kann nicht niedriger sein als 1 €',
  max: 'Kaufpreis kann nicht höher sein als 1.000.000.000 €',
};

registerLocaleData(localeDe, GERMAN_LOCALE);

storiesOf('EditableText', module)
  .addDecorator(MODULE_METADATA)
  .add('SellingPrice', () => {
    return {
      props: {
        sellingPrice: 0,
        sellingPriceEditing: false,
        sellingPriceValidators: [
          Validators.required,
          TransformControlValueValidators.min(MIN_SELLING_PRICE, cleanFormattedAmountString),
          TransformControlValueValidators.max(MAX_SELLING_PRICE, cleanFormattedAmountString),
        ],
        sellingPriceErrorMessages: SELLING_PRICE_ERROR_MESSAGES,
        sellingPriceInputMask: AMOUNT_INPUT_MASK(10),
        sellingPriceTransform: () => {
          return (editableText: string) => {
            const cleanedEditableText = cleanFormattedAmountString(editableText);
            const sellingPrice = toNumber(cleanedEditableText, 0);
            return new CurrencyPipe('de_DE')
              .transform(sellingPrice, 'EUR', true, '1.0-0');
          };
        },
        getJSON: (value: string, editing: boolean) => {
          return {
            value,
            editing,
          };
        },
        save: (value: string) => {
          console.log('### SAVE', value);
        },
      },
      template: `
        <div class="sp-section">
          <h1>Selling price</h1>
          <table class="sp-layout-table" style="width: 30%;">
            <tr>
              <td>
                <app-editable-text
                  identifier="selling-price"
                  label="Kaufpreis"
                  [(editing)]="sellingPriceEditing"
                  [(value)]="sellingPrice"
                  [nonEditableTextTransform]="sellingPriceTransform()"
                  [editableTextValidators]="sellingPriceValidators"
                  [editableTextValidatorErrorMessages]="sellingPriceErrorMessages"
                  [editableTextInputMask]="sellingPriceInputMask"
                  (save)="save($event)"
                ></app-editable-text>
              </td>
            </tr>
            <tr>
              <td>
                <pre class="sp-code">{{ getJSON(sellingPrice, sellingPriceEditing) | json }}</pre>
              </td>
            </tr>
          </table>
        </div>
      `,
    };
  });
