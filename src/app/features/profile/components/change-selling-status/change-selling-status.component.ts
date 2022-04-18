import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import {
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { AMOUNT_INPUT_MASK } from '../../../../shared/utils/amount-input-mask.util';
import { cleanFormattedAmountString } from '../../../../shared/utils/string.util';
import { TransformControlValueValidators } from '../../../../shared/validators/transform-control-value.validator';
import { toNumber } from '../../../../shared/utils/to-number.util';
import { InputTextMask } from '../../../../core/models/input-text-mask.model';
import { PropertyStatus } from '../../../../core/models/properties-repository.model';

export interface SaleStatus {
  sellingStatus: PropertyStatus;
  sellingPrice: number;
}

const MIN_SELLING_PRICE = 1;
const MAX_SELLING_PRICE = 1000 * 1000 * 1000;

const SELLING_PRICE_ERROR_MESSAGES: { [ error: string ]: string } = {
  required: 'Kaufpreis ist ein Pflichtfeld',
  min: 'Kaufpreis kann nicht niedriger sein als 1 €',
  max: 'Kaufpreis kann nicht höher sein als 1.000.000.000 €',
};

@Component({
  selector: 'app-change-selling-status',
  templateUrl: './change-selling-status.component.html',
  styleUrls: [
    './change-selling-status.component.css',
  ],
})
export class ChangeSellingStatusComponent implements OnChanges {
  @Input() saleStatus: SaleStatus;

  @Input() isOwner: boolean;
  @Input() isRealtor: boolean;
  @Input() hasRealtor: boolean;

  @Output() saleStatusChange: EventEmitter<SaleStatus> = new EventEmitter<SaleStatus>();

  @Output() saleStatusSave: EventEmitter<SaleStatus> = new EventEmitter<SaleStatus>();

  @Input()
  @HostBinding('class.change-selling-status--disabled')
  isDisabled: boolean = false;

  public _name = 'change-selling-status';

  public openForOffers: boolean;
  public putUpForSale: boolean;
  public sellingPrice: string;
  public sellingPriceErrorMessages: { [ error: string ]: string } = SELLING_PRICE_ERROR_MESSAGES;
  public sellingPriceInputMask: InputTextMask = AMOUNT_INPUT_MASK(10);
  public sellingPriceEditing: boolean;

  public sellingPriceValidators: ValidatorFn[] = [
    Validators.required,
    TransformControlValueValidators.min(MIN_SELLING_PRICE, cleanFormattedAmountString),
    TransformControlValueValidators.max(MAX_SELLING_PRICE, cleanFormattedAmountString),
  ];

  private initialSaleStatus: SaleStatus;

  private get sellingStatus(): PropertyStatus {
    if (this.openForOffers) {
      return PropertyStatus.MakeMeMove;
    } else if (this.putUpForSale) {
      return PropertyStatus.ForSale;
    } else {
      return PropertyStatus.Active;
    }
  }

  private get sellingStatusIsValid(): boolean {
    if (!this.openForOffers && !this.putUpForSale) {
      return true;
    } else if (this.openForOffers) {
      return true;
    } else if (this.putUpForSale) {
      const sellingPrice = toNumber(cleanFormattedAmountString(this.sellingPrice), 0);
      return sellingPrice > 0;
    }

    return false;
  }

  constructor(private currencyPipe: CurrencyPipe) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.isDisabled = this.isOwner && this.hasRealtor && !this.isRealtor;

    const changedSaleStatus = changes.saleStatus ? changes.saleStatus.currentValue : null;

    this.initialSaleStatus = { ...changedSaleStatus };
    if (changedSaleStatus) {
      const { sellingStatus } = changedSaleStatus;
      if (sellingStatus === 'MakeMeMove') {
        this.openForOffers = true;
        this.putUpForSale = false;
        this.sellingPrice = '';
        this.sellingPriceEditing = false;
        return;
      }

      if (sellingStatus === 'ForSale') {
        const { sellingPrice } = changedSaleStatus;
        this.putUpForSale = true;
        this.openForOffers = false;
        this.sellingPrice = `${ sellingPrice }`;
        this.sellingPriceEditing = false;
        return;
      }
    }

    this.openForOffers = false;
    this.putUpForSale = false;
    this.sellingPrice = '';
    this.sellingPriceEditing = false;
  }

  public onOpenForOffersChange(openForOffers: boolean): void {
    this.openForOffers = openForOffers;
    if (this.openForOffers) {
      this.putUpForSale = false;
      this.sellingPrice = '';
    }
    if (!this.openForOffers && !this.putUpForSale) {
      this.sellingPrice = '';
    }
    if (this.sellingStatusIsValid) {
      this.emitSaleStatusSave();
    }
  }

  public onPutUpForSaleChange(putUpForSale: boolean): void {
    this.putUpForSale = putUpForSale;
    if (this.putUpForSale) {
      this.openForOffers = false;

      const hasSellingPrice = this.sellingPrice && this.sellingPrice.length > 0;
      if (hasSellingPrice) {
        this.sellingPriceEditing = false;
      } else {
        this.sellingPriceEditing = true;
      }
    }

    if (!this.openForOffers && !this.putUpForSale) {
      this.sellingPrice = '';
      this.emitSaleStatusSave();
    }
  }

  public sellingPriceTransform(): Function {
    return (editableText: string) => {
      const initialSellingPrice = this.initialSaleStatus ? this.initialSaleStatus.sellingPrice : 0;
      const cleanedEditableText = cleanFormattedAmountString(editableText);
      const sellingPrice = toNumber(cleanedEditableText, initialSellingPrice);
      return this.currencyPipe.transform(sellingPrice, 'EUR', true, '1.0-0');
    };
  }

  public onSellingPriceSave(sellingPriceString: string): void {
    this.sellingPrice = sellingPriceString;
    if (this.sellingStatusIsValid) {
      this.emitSaleStatusSave();
    }
  }

  public onSellingPriceChange(sellingPriceString: string): void {
    this.sellingPrice = sellingPriceString;
    const saleStatusToEmit = this.sellingStatusIsValid
      ? this.createSaleStatus()
      : { ...this.initialSaleStatus };
    this.emitSaleStatusChange(saleStatusToEmit);
  }

  private emitSaleStatusSave(): void {
    this.saleStatusSave.emit(this.createSaleStatus());
  }

  private emitSaleStatusChange(saleStatus?: SaleStatus): void {
    const saleStatusToEmit = saleStatus ? saleStatus : this.createSaleStatus();
    this.saleStatusChange.emit(saleStatusToEmit);
  }

  private createSaleStatus(): SaleStatus {
    const sellingStatus = this.sellingStatus;
    const initialSellingPrice = this.initialSaleStatus ? this.initialSaleStatus.sellingPrice : 0;
    const sellingPrice = this.putUpForSale
      ? toNumber(cleanFormattedAmountString(this.sellingPrice), initialSellingPrice)
      : initialSellingPrice;
    return {
      sellingStatus,
      sellingPrice,
    };
  }
}
