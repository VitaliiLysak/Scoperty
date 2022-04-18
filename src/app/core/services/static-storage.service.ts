import { Injectable } from '@angular/core';

export interface StaticData {
  id: number;
  text: string;
}

export interface StaticDataFeBe {
  id: number;
  text: string;
  shortText?: string;
  textBe: string;
}

@Injectable()
export class StaticStorageService {

  propertyConditionGlossary: StaticDataFeBe[] = [
    {
      id: 1,
      text: 'Erstbezug',
      textBe: 'brand_new',
    },
    {
      id: 2,
      text: 'Neuwertig',
      textBe: 'as_new',
    },
    {
      id: 3,
      text: 'Modernisiert',
      textBe: 'modernized',
    },
    {
      id: 4,
      text: 'Renoviert',
      textBe: 'renovated',
    },
    {
      id: 5,
      text: 'Gepflegt',
      textBe: 'groomed',
    },
    {
      id: 6,
      text: 'Renovierungsbedürftig',
      textBe: 'for_refurbishment',
    },
  ];

  propertySubHouseTypeGlossary: StaticDataFeBe[] = [
    {
      id: 1,
      text: 'Einfamilienhaus',
      textBe: 'detached',
    },
    {
      id: 2,
      text: 'Doppelhaushälfte',
      textBe: 'semi_detached',
    },
    {
      id: 3,
      text: 'Reihenendhaus',
      textBe: 'row_corner',
    },
    {
      id: 4,
      text: 'Reihenmittelhaus',
      textBe: 'row_middle',
    },
    {
      id: 5,
      text: 'Zweifamilienhaus',
      textBe: 'double_house',
    },
    {
      id: 6,
      text: 'Bauernhaus',
      textBe: 'farm',
    },
    {
      id: 7,
      text: 'Bungalow',
      textBe: 'bungalow'
    },
    {
      id: 8,
      text: 'Schloss',
      textBe: 'castle'
    },
    {
      id: 9,
      text: 'Villa',
      textBe: 'villa'
    }
  ];

  propertySubApartmentTypeGlossary: StaticDataFeBe[] = [
    {
      id: 1,
      text: 'Etagenwohnung',
      textBe: 'normal',
    },
    {
      id: 2,
      text: 'Apartment',
      textBe: 'studio',
    },
    {
      id: 3,
      text: 'Loft',
      textBe: 'loft'
    },
    {
      id: 4,
      text: 'Maisonette',
      textBe: 'maisonette',
    },
    {
      id: 5,
      text: 'Penthouse',
      textBe: 'penthouse',
    },
    {
      id: 6,
      text: 'Terassenwohnung',
      textBe: 'terraced',
    },
    {
      id: 7,
      text: 'Dachgeschoss',
      textBe: 'attic'
    }
  ];

  floorLocationGlossary: StaticDataFeBe[] = [
    {
      id: 1,
      text: 'Links',
      textBe: 'left',
    },
    {
      id: 2,
      text: 'Recht',
      textBe: 'right',
    },
    {
      id: 3,
      text: 'Mitte',
      textBe: 'middle',
    },
  ];

  propertyFloorGlossary: StaticData[] = [
    {
      id: 1,
      text: 'UG'
    },
    {
      id: 2,
      text: 'EG'
    },    {
      id: 3,
      text: '1.OG'
    },    {
      id: 4,
      text: '2.OG'
    },    {
      id: 5,
      text: '3.OG'
    },    {
      id: 6,
      text: '4.OG'
    },
    {
      id: 7,
      text: '5.OG'
    },
    {
      id: 8,
      text: '6.OG'
    },
    {
      id: 9,
      text: '7.OG'
    },
    {
      id: 10,
      text: '8.OG'
    },
    {
      id: 11,
      text: '9.OG'
    },
    {
      id: 12,
      text: '10.OG'
    },
    {
      id: 13,
      text: '11.OG'
    },
    {
      id: 14,
      text: '12.OG'
    },
    {
      id: 15,
      text: '13.OG'
    },
    {
      id: 16,
      text: '14.OG'
    },
    {
      id: 17,
      text: '15.OG'
    },
    {
      id: 18,
      text: '16.OG'
    },
    {
      id: 19,
      text: '17.OG'
    },
    {
      id: 20,
      text: '18.OG'
    },
    {
      id: 21,
      text: '19.OG'
    },
    {
      id: 22,
      text: '20.OG'
    },
  ];

  typesOfSortFilterResutsGlossary: StaticData[] = [
    {
      id: 1,
      text: 'Kaufpreis (höchste zuerst)'
    },
    {
      id: 2,
      text: 'Kaufpreis (niedrigste zuerst)'
    },
  ];

  typesOfSortFilterChatList: StaticDataFeBe[] = [
    {
      id: 1,
      text: 'Kaufinteressent',
      textBe: 'potential buyer'
    },
    {
      id: 2,
      text: 'Eigentümer',
      textBe: 'owner'
    },
    {
      id: 3,
      text: 'Alle',
      textBe: 'all'
    }
  ];

  typesOfProperty: StaticDataFeBe[] = [
    {
      id: 1,
      text: 'Haus',
      textBe: 'EFH'
    },
    {
      id: 2,
      text: 'Wohnung',
      textBe: 'ETW',
    },
  ];

  energyCertificateStatusGlossary: StaticDataFeBe[] = [
    {
      id: 1,
      text: 'Liegt vor',
      shortText: 'vorhanden',
      textBe: 'available',
    },
    {
      id: 2,
      text: 'Liegt zur Besichtigung vor',
      shortText: 'zur einsicht vorhanden',
      textBe: 'available_for_inspection',
    },
    {
      id: 3,
      text: 'Unterliegt nicht den Anforderungen der EnEV',
      shortText: 'nicht EnEV thema',
      textBe: 'not_a_subject_of_enev',
    }
  ];

  energyCertificateDateGlossary: StaticDataFeBe[] = [
    {
      id: 1,
      text: 'bis 30.04.2014',
      textBe: 'till_30_04_2014',
    },
    {
      id: 2,
      text: 'ab 01.05.2014',
      textBe: 'from_01_05_2014',
    }
  ];

  energyCertificateTypeGlossary: StaticDataFeBe[] = [
    {
      id: 1,
      text: 'Bedarfsausweis',
      textBe: 'demand',
    },
    {
      id: 2,
      text: 'Verbrauchsausweis',
      textBe: 'usage',
    }
  ];

  energySourceGlossary: StaticDataFeBe[] = [
    {
      id: 1,
      text: 'Gas',
      textBe: 'gas',
    },
    {
      id: 2,
      text: 'Fernwärme',
      textBe: 'district_heating',
    },
    {
      id: 3,
      text: 'Öl',
      textBe: 'oil',
    },
    {
      id: 4,
      text: 'Elektro',
      textBe: 'electricity',
    },
    {
      id: 5,
      text: 'Erdwärme',
      textBe: 'geothermal',
    },
    {
      id: 6,
      text: 'Pellets',
      textBe: 'wood_pellets',
    },
    {
      id: 7,
      text: 'Solar',
      textBe: 'solar',
    }
  ];

  energyConsumptionClassGlossary: StaticDataFeBe[] = [
    {
      id: 1,
      text: 'A+',
      textBe: 'a+',
    },
    {
      id: 2,
      text: 'A',
      textBe: 'a',
    },
    {
      id: 3,
      text: 'B',
      textBe: 'b',
    },
    {
      id: 4,
      text: 'C',
      textBe: 'c',
    },
    {
      id: 5,
      text: 'D',
      textBe: 'd',
    },
    {
      id: 6,
      text: 'E',
      textBe: 'e',
    },
    {
      id: 7,
      text: 'F',
      textBe: 'f',
    },
    {
      id: 8,
      text: 'G',
      textBe: 'g',
    },
    {
      id: 9,
      text: 'H',
      textBe: 'h'
    }
  ];

  heatingTypeGlossary: StaticDataFeBe[] = [
    {
      id: 1,
      text: 'Fußbodenheizung',
      textBe: 'underfloor_heating',
    },
    {
      id: 2,
      text: 'Einzelöfen',
      textBe: 'single_stoves',
    },
    {
      id: 3,
      text: 'Zentralheizung',
      textBe: 'central_heating',
    },
    {
      id: 4,
      text: 'Etagenheizung',
      textBe: 'floors_heating',
    },
  ];

  facilitiesQualityGlossary: StaticDataFeBe[] = [
    {
      id: 1,
      text: 'Luxus',
      textBe: 'luxury',
    },
    {
      id: 2,
      text: 'Gehoben',
      textBe: 'high',
    },
    {
      id: 3,
      text: 'Normal',
      textBe: 'standard',
    },
    {
      id: 4,
      text: 'Einfach',
      textBe: 'low',
    },
  ];

  roofCoveringGlossary: StaticDataFeBe[] = [
    {
      id: 1,
      text: 'Dachpappe',
      textBe: 'roof_paper',
    },
    {
      id: 2,
      text: 'Dachpfannen',
      textBe: 'roof_panels',
    },
    {
      id: 3,
      text: 'Metall',
      textBe: 'metal',
    },
    {
      id: 4,
      text: 'Schiefer',
      textBe: 'slate',
    },
    {
      id: 5,
      text: 'Sonstiges',
      textBe: 'other',
    }
  ];

  windowsGlossary: StaticDataFeBe[] = [
    {
      id: 1,
      text: 'Isolierverglasung',
      textBe: 'insulating',
    },
    {
      id: 2,
      text: 'Doppelverglasung',
      textBe: 'double',
    },
    {
      id: 3,
      text: 'Dreifachverglasung',
      textBe: 'triple',
    },
    {
      id: 4,
      text: 'Spezialverglasung',
      textBe: 'special',
    },
    {
      id: 5,
      text: 'Raumhohe Verglasung',
      textBe: 'room_high_glazing',
    },
    {
      id: 6,
      text: 'Kastenfenster',
      textBe: 'case_window'
    },
    {
      id: 7,
      text: 'Einfache Fenster',
      textBe: 'simple'
    },
    {
      id: 8,
      text: 'Sonstiges',
      textBe: 'other'
    }
  ];

  flooringGlossary: StaticDataFeBe[] = [
    {
      id: 1,
      text: 'Fliesen',
      textBe: 'tiles',
    },
    {
      id: 2,
      text: 'Kunststoff/PVC',
      textBe: 'plastic',
    },
    {
      id: 3,
      text: 'Parkett/Naturstein',
      textBe: 'parquet_natural_stone',
    },
    {
      id: 4,
      text: 'Teppich/Laminat',
      textBe: 'carpet_laminate',
    },
    {
      id: 5,
      text: 'Sonstiges',
      textBe: 'other',
    }
  ];

}
