import {
  PropertyType,
  PropertyTypeDto,
  PropertyStatus,
  PropertyStatusDto,
} from '../../core/models/properties-repository.model';

interface RawSellingStatus {
  hasOwner: boolean;
  hasRealtor: boolean;
  sellingStatus: PropertyStatusDto;
}

const typeBackEnd = {
  apartment: PropertyType.ETW,
  single_family_house: PropertyType.EFH,
  multi_family_house: PropertyType.MFH,
  all: PropertyType.All,
};

const typeFrontEnd = {
  ETW: 'apartment',
  EFH: 'single_family_house',
  MFH: 'multi_family_house',
};

const typeForTemplateFromBackEnd = {
  apartment:           'Wohnung',
  single_family_house: 'Haus',
  multi_family_house:  'Mehrfamilienhaus',
};

const statusBackEnd = {
  inactive: PropertyStatus.Idle,
  active: PropertyStatus.Active,
  not_active_yet: PropertyStatus.NotActiveYet, // BE does't have not_active_yet selling status
  make_me_move: PropertyStatus.MakeMeMove,
  for_sale: PropertyStatus.ForSale,
  all: PropertyStatus.All,
};

const statusFrontEnd = {
  Idle: PropertyStatusDto.Inactive,
  Active: PropertyStatusDto.Active,
  NotActiveYet: PropertyStatusDto.Active,
  MakeMeMove: PropertyStatusDto.MakeMeMove,
  ForSale: PropertyStatusDto.ForSale,
};

const statusForTemplateFromBackEnd = {
  inactive:     'Deaktiviert',
  active:       'Noch nicht aktiv',
  make_me_move: 'Offen für Gebote',
  for_sale:     'Zum Verkauf',
};

const statusForTemplateFromFrontEnd = {
  Idle:         'Deaktiviert',
  MakeMeMove:   'Offen für Gebote',
  ForSale:      'Zum Verkauf',
  Active:       'Aktiv',
  NotActiveYet: 'Noch nicht aktiv', // Do not delete ! Status for property-detail
};

export function statusToBackEnd(status: PropertyStatus): PropertyStatusDto {
  return statusFrontEnd[status];
}

export function statusToFrontEnd({hasOwner, hasRealtor, sellingStatus}: RawSellingStatus): PropertyStatus {
  return ((!hasOwner && !hasRealtor) && sellingStatus === 'active')
    ? statusBackEnd['not_active_yet']
    : statusBackEnd[sellingStatus];
}

export function statusToFrontEndOriginal(sellingStatus: string): PropertyStatus {
  return statusBackEnd[sellingStatus];
}

export function templateStatusToFrontend(status: string): string {
  return statusForTemplateFromFrontEnd[status];
}

export function templateStatusToBackend(status: string): string {
  return statusForTemplateFromBackEnd[status];
}

export function propTypeToBackEnd(type: PropertyType): PropertyTypeDto {
  return typeFrontEnd[type];
}

export function propTypeToFrontEnd(type: PropertyTypeDto): PropertyType {
  return typeBackEnd[type];
}

export function templatePropertyTypeToFrontend(type: string): string {
  return typeForTemplateFromBackEnd[type];
}
