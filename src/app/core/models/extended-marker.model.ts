import { toNumber } from '../../shared/utils/to-number.util';
import { statusToBackEnd, templateStatusToFrontend } from '../../shared/utils/deserializator.util';
import { SellingStatusFE } from '../../app.constants';
import { isNullOrUndefined } from '../../shared/utils/null-or-undefined.util';
import { isEmptyString } from '../../shared/utils/empty-string.util';
import { PropertyListingCreationData, PropertyStatusDto } from '../../core/models/properties-repository.model';
import { isEmptyArray } from '../../shared/utils/empty-array.util';

import { EmbededAppartment } from './embeded-appartment.model';
import { IImage } from './image.model';
import { MarkerModel } from './marker.model';

export interface ApartmentStateMap {
  ForSale: EmbededAppartment[];
  MakeMeMove: EmbededAppartment[];
  WithOwner: EmbededAppartment[];
}

interface SimilarProperty {
  PropertyId:     string;
  PropertyType:   string;
  extendedType?:  string;
  WishedPrice:    number;
  Images:         string[];
  images?:        string[];
}

interface EstimatedPriceTrend {
  Year:     string;
  Quarter:  string;
  Trend:    string;
}

enum EnergyCertificateDate {
  FromMay2014 = 'from_01_05_2014',
  TillMay2014 = 'till_30_04_2014',
}

export type ExtendedMarkerModelKey = keyof ExtendedMarkerModel;

export type ExtendedMarkerModelMember = ExtendedMarkerModel[ExtendedMarkerModelKey];

export class ExtendedMarkerModel extends MarkerModel {
  // GEO
  Geom:           [[number, number]][];
  // Location
  Country:        string;
  County:         string;
  Locality:       string;
  State:          string;
  Neighbourhood:  string;
  Street:         string;
  HouseNumber:    string;
  PostalCode:     string;

  // Prices
  WishedPrice:                        number;
  EstimatedPrice:                     number;
  EstimatedPricePerM2:                number;
  EstimatedPriceMax:                  number; // For Building
  EstimatedPriceMin:                  number; // For Building
  OfferPrice:                         number;

  // Rating
  EstimationScore: number;
  RatingsHigh:     number;
  RatingsOk:       number;
  RatingsLow:      number;
  RatingsTotal:    number;

  // Data
  ConstructionYear:       string;
  LastModernisationYear:  string;
  LivingSurfaceMax:       number; // For Building
  LivingSurface:          number;
  LivingSurfaceMin:       number; // For Building
  TotalArea:              number;
  GardenArea:             number;
  BalconyArea:            number;
  TerraceArea:            number;
  RoomsNumber:            number;
  BedroomsNumber:         number;
  BathroomsNumber:        number;
  SeparateWcNumber:       number;
  BalconiesNumber:        number;
  TerracesNumber:         number;
  GaragesNumber:          number;
  FlatsNumber:            number;
  NumberOfUnits:            number;

  Parking:                boolean;
  ParkingNumber:          number;

  Listing:                boolean;

  // tslint:disable-next-line:max-line-length
  PropertyCondition:      string; // one from "Erstbezug", "Neuwertig", "Modernisiert", "Renoviert", "Gepflegt", "Renovierungsbedürftig", "Abbruchreif", "Keine Angabe"
  Flooring:               string; // For Building
  Windows:                string; // For Building
  RoofCovering:           string; // For Building
  Door:                   string; // For Building
  FloorLocation:          string;

  Kitchen:                boolean;
  Elevator:               boolean;
  TerraceBalcony:         boolean;
  VisitorsWC:             boolean;
  Garden:                 boolean;
  Cellar:                 boolean;
  HistoricalProperty:     boolean;
  OldProperty:            boolean;
  SecondaryEntrance:      boolean;
  Rented:                 boolean;
  Garage:                 boolean;
  Terrace:                boolean;
  Balcony:                boolean;
  Chimney:                boolean;
  AirConditioned:         boolean;
  Sauna:                  boolean;
  SwimmingPool:           boolean;
  HasDryWashSpace:        boolean;
  BikeRoom:               boolean;
  LeaseHold:              boolean;
  Furnished:              boolean;
  BarrierFree:            boolean;

  FacilitiesQuality:      string; // one from "Luxus", "Gehoben", "Normal", "Einfach"
  FurnishingYear:         string; // one from "Luxus", "Gehoben", "Normal", "Einfach"

  Floor:                  number;
  FloorNumber:            number;

  Title:                  string;
  Description:            string;

  RealtorPercentage:             string;
  RealtorPercentageDescription:  string;

  WaterHeatingIncluded:       boolean;
  EnergyCertificateURL: string;
  EnergyCertificateValue:     number;
  EnergyCertificate:          boolean;
  EnergyCertificateFileId:    string;
  // tslint:disable-next-line:max-line-length
  EnergyCertificateStatus:    string; // one from "Energieausweis liegt vor", "Energieausweis liegt zur Besichtigung vor", "Dieses Gebäude unterliegt nicht den Anforderungen der EnEV"
  EnergyCertificateType:      string; // one from "Bedarfsausweis", "Verbrauchsausweis"
  EnergyCertificateDate:      EnergyCertificateDate; // one from "bis 30.04.2014", "ab 01.05.2014"
  // tslint:disable-next-line:max-line-length
  EnergySource:               string; // one from "Keine Angabe", "Erdwärme", "Solar", "Holzpellets", "Gas", "Öl", "Fernwärme", "Strom", "Kohle", "Erdgas leicht", "Erdgas schwer", "Flüssiggas", "Fernwärme-Dampf", "Holz", "Holz-Hackschnitzel", "Kohle/Koks", "Nahwärme", "Wärmelieferung", "Bioenergie", "Windenergie", "Wasserenergie", "Umweltwärme", "KWK fossil", "KWK erneuerbar", "KWK regenerative", "KWK bio"
  EnergyConsumptionValue:     number;
  EnergyConsumptionClass:     string; // one from "Keine Angabe", "A+", "A", "B", "C", "D", "E", "F", "G", "H"
  // tslint:disable-next-line:max-line-length
  HeatingType:                string; // one from "Blockheizkraftwerk", "Elektroheizung", "Etagenheizung", "Fernwärme", "Fußbodenheizung", "Gasheizung", "Holz-Pelletheizung", "Nachtspeicheröfen", "Ofenheizung", "Ölheizung", "Solar-Heizung", "Wärmepumpe", "Zentralheizung", "Keine Angabe"

  // For Appartment
  BuildingPropertyId: string;

  // For Building
  Apartments: EmbededAppartment[];
  Listings: EmbededAppartment[];

  // tslint:disable-next-line:max-line-length
  Images: IImage[];

  //
  SimilarProperties: SimilarProperty[];
  similarProperties: SimilarProperty[];

  //
  EstimatedPriceTrend: EstimatedPriceTrend[];

  //
  Favourite:          boolean;
  isOwner:            boolean;
  isRealtor:          boolean;
  hasOwner:            boolean;
  hasRealtor:          boolean;
  Ownership:          boolean;
  PropertyActivated:  boolean;

  ShowAddress:   boolean;
  Url:           string;
  Source:        string;

  NumberOfDefinedUnits: number;
  NumberOfDisabledUnits: number;
  matchedProperty: string;
  OperationCost: number;

  propertyEditValid: boolean;

  get hasTitle(): boolean {
    return !isEmptyString(this.Title);
  }

  get fullAddress(): string {
    const { PostalCode, Locality, Street, HouseNumber } = this;
    const hasFullAddress = !isEmptyString(PostalCode)
      && !isEmptyString(Locality)
      && !isEmptyString(Street)
      && !isEmptyString(HouseNumber);
    if (hasFullAddress) {
      return `${ Street } ${ HouseNumber }, \n ${ PostalCode } ${ Locality }`;
    }

    return 'Keine Adresse';
  }

  get isFavourite(): boolean {
    return this.Favourite;
  }

  get doesOwnerOrRealtorExist(): boolean {
    return this.hasOwner || this.hasRealtor;
  }

  set isFavourite(value: boolean) {
    this.Favourite = value;
  }

  get isStatusForHide(): boolean {
    return this.SellingStatus === 'NotActiveYet' || this.SellingStatus === 'Active';
  }

  get currentUserIsOwner(): boolean {
    return this.Ownership;
  }

  get images(): string[] {
    return isNullOrUndefined(this.Images) ? [] : this.Images.map(imgObj => imgObj.src);
  }

  get hasImages(): boolean {
    return !isEmptyArray(this.images);
  }

  get isParkingSpecified(): boolean {
    return !isNullOrUndefined(this.Parking);
  }

  get firstImage(): string {
    return this.hasImages ? this.images[0] : null;
  }

  get extendedSellingStatus(): string {
    return templateStatusToFrontend(this.SellingStatus);
  }

  get propertyPrice(): number {
    return this.Listing ? this.SalePrice : this.EstimatedPrice;
  }

  get apartmentStateMap(): ApartmentStateMap {
    const apartmentStateMap: ApartmentStateMap = {
      ForSale: [],
      MakeMeMove: [],
      WithOwner: [],
    };
    const forSaleOrOpenForOffers: SellingStatusFE[] = [
      'ForSale',
      'MakeMeMove',
    ];
    for (const apartment of this.Apartments) {
      const apartmentForSaleOrOpenForOffers = forSaleOrOpenForOffers.includes(apartment.SellingStatus as SellingStatusFE);
      if (apartmentForSaleOrOpenForOffers) {
        apartmentStateMap[apartment.SellingStatus].push(apartment);
      }

      const hasOwner = this.apartmentIsActiveAndHasOwner(apartment);
      if (hasOwner) {
        apartmentStateMap.WithOwner.push(apartment);
      }
    }

    return apartmentStateMap;
  }

  get scrappedListings(): EmbededAppartment[] {
    return this.Listings.filter(listing => !isEmptyString(listing.Url));
  }

  getApartmentsForKey(mapKey: keyof ApartmentStateMap): EmbededAppartment[] {
    return this.apartmentStateMap[mapKey];
  }

  getNumberOfApartmentsForKey(mapKey: keyof ApartmentStateMap): number {
    const apartmentsForKey = this.apartmentStateMap[mapKey];
    let length = 0;
    if (!isNullOrUndefined(apartmentsForKey)) {
      length += apartmentsForKey.length;
    }
    if (mapKey === 'ForSale' && !isNullOrUndefined(this.Listings)) {
      length += this.Listings.length;
    }

    return length;
  }

  get hasEquipment(): boolean {
    const comfort = this.Kitchen || this.Elevator || this.Garage || this.Parking ||
      this.Terrace || this.Balcony || this.Chimney || this.AirConditioned ||
      this.Sauna || this.SwimmingPool || this.HasDryWashSpace || this.BikeRoom ||
      this.VisitorsWC || this.Garden || this.Cellar || this.HistoricalProperty ||
      this.SecondaryEntrance || this.Furnished || this.BarrierFree;

    return !!comfort;
  }

  get hasEnergyInfo(): boolean {
    return !!(
      this.EnergyCertificate ||
      this.EnergyCertificateFileId ||
      this.EnergyCertificateStatus ||
      this.EnergyCertificateType ||
      this.EnergyConsumptionClass ||
      this.EnergyConsumptionValue ||
      this.EnergySource ||
      this.HeatingType ||
      this.hasEnergyCertificateFile
    );
  }

  get hasEnergyCertificateFile(): boolean {
    return !isEmptyString(this.EnergyCertificateURL);
  }

  get hasDescription(): boolean {
    return !isEmptyString(this.Description);
  }

  get address(): string {
    return `${this.Street} ${this.HouseNumber}, ${this.PostalCode} ${this.Locality}`;
  }

  get hasApartments(): boolean {
    return this.Apartments.length > 0;
  }

  get hasRooms(): boolean {
    return !isNullOrUndefined(this.RoomsNumber) && this.RoomsNumber > 0;
  }

  get hasUrl(): boolean {
    return !isEmptyString(this.Url);
  }

  get hasMatchedProperty(): boolean {
    return !isNullOrUndefined(this.matchedProperty);
  }

  /**
   * New Deserializer
   * @param data
   */
  deserialize(data: any): void {
    super.deserialize(data);

    this.Country                  = data.country;             // required string - Value:"DE"
    this.County                   = data.county;              // string (County) <= 255 characters
    this.Locality                 = data.city;                // required string (City) [ 1 .. 255 ] characters
    this.State                    = data.state;               // string (State) <= 255 characters
    this.Neighbourhood            = data.neighbourhood;
    this.Street                   = data.streetName;          // string (Street name) <= 255 characters
    this.HouseNumber              = data.streetNumber;        // string (Street number) <= 50 characters
    this.PostalCode               = data.zipCode;             // string (Zip code) <= 50 character
    this.WishedPrice              = this.Price;

    // integer (Estimated price) [ -2147483648 .. 2147483647 ]
    this.EstimatedPrice           = toNumber(data.estimatedPrice, 0);
    this.EstimatedPricePerM2      = toNumber(data.estimatedPriceM2, 0);

    this.EstimatedPriceMax        = this.EstimatedPrice;
    this.EstimatedPriceMin        = this.EstimatedPrice;
    this.OfferPrice               = this.Price;

    this.ConstructionYear         = data.constructionYear;        // string <date> (Construction year)
    this.LastModernisationYear    = data.renovationYear;          // string <date> (Renovation year)
    this.FurnishingYear           = data.furnishingYear;          // string <date> (Renovation year)   @NEW

    this.RoomsNumber              = data.numberOfRooms;           // integer (Number of rooms) [ 0 .. 32767 ]
    this.BedroomsNumber           = data.numberOfBedrooms;        // integer (Number of rooms) [ 0 .. 32767 ] @NEW
    this.BathroomsNumber          = data.numberOfBathrooms;       // integer (Number of rooms) [ 0 .. 32767 ] @NEW
    this.SeparateWcNumber         = data.numberOfSeparateWc;      // integer (Number of rooms) [ 0 .. 32767 ] @NEW
    this.BalconiesNumber          = data.numberOfBalconies;       // integer (Number of rooms) [ 0 .. 32767 ] @NEW
    this.TerracesNumber           = data.numberOfTerraces;        // integer (Number of rooms) [ 0 .. 32767 ] @NEW
    this.GaragesNumber            = data.numberOfGarages;         // integer (Number of rooms) [ 0 .. 32767 ] @NEW
    this.ParkingNumber            = data.numberOfParking || 0;    // integer (Number of rooms) [ 0 .. 32767 ]
    this.FloorNumber              = data.numberOfFloors;          // integer (Number of rooms) [ 0 .. 32767 ]
    this.FlatsNumber              = data.numberOfFlats;           // integer (Number of rooms) [ 0 .. 32767 ] @NEW
    this.NumberOfUnits            = data.numberOfUnits;           // integer (Number of appartments in MFH) [ 0 .. 32767 ] @NEW

    /**
     * @FIXME: CHECK DATA LivingSurface === livingArea
     */
    this.LivingSurface            = data.livingArea || 0;
    this.LivingSurfaceMax         = data.usableArea;
    this.LivingSurfaceMin         = data.livingArea;            // integer (Usable area (m2)) [ 0 .. 32767 ]      @NEW
    this.TotalArea                = data.totalArea || 0;	      // integer (Total area (m2)) [ 0 .. 2147483647 ]  @NEW
    this.GardenArea               = data.gardenArea;            // integer (Garden area (m2)) [ 0 .. 32767 ]      @NEW
    this.BalconyArea              = data.balconyArea;           // integer (Balcony area (m2)) [ 0 .. 32767 ]     @NEW
    this.TerraceArea              = data.terraceArea;	          // integer (Terrace area (m2)) [ 0 .. 32767 ]     @NEW

    this.PropertyCondition        = data.propertyCondition;

    this.Kitchen                  = data.hasKitchen;              // boolean (Has kitchen)
    this.Elevator                 = data.hasElevator;             // boolean (Has elevator)
    this.Garage                   = data.hasGarage;                        // boolean (Has garage)
    this.Parking                  = data.hasParking;                       // boolean (Has parking)
    this.Listing                  = data.hasListing;                       // boolean
    this.Terrace                  = data.hasTerrace;                       // boolean (Has terrace)          @NEW  old teracebalcony
    this.Balcony                  = data.hasBalcony;              // boolean (Has balcony)          @NEW  old teracebalcony
    this.Chimney                  = data.hasChimney;	             // boolean (Has chimney)          @NEW
    this.AirConditioned           = data.hasAirConditioned;	     // boolean (Has air conditioned)  @NEW
    this.Sauna                    = data.hasSauna;                // boolean (Has sauna)            @NEW
    this.SwimmingPool             = data.hasSwimmingPool;	       // boolean (Has swimming pool)    @NEW
    this.HasDryWashSpace          = data.hasDryWashSpace;	                 // boolean (Has dry wash space)   @NEW
    this.BikeRoom                 = data.hasBikeRoom;	                     // boolean (Has bike room)        @NEW
    // @FIXME: need to get this property from DB
    this.VisitorsWC               = data.hasVisitorsWc;
    this.Garden                   = data.hasGarden;               // boolean (Has garden)
    this.Cellar                   = data.hasCellar;               // boolean (Has cellar)
    this.HistoricalProperty       = data.isHistoricalProperty;             // boolean (Is historical property)
    this.OldProperty              = data.isOldProperty;                    // boolean (Is old property)
    this.LeaseHold                = data.isLeaseHold;                      // boolean (Is lease hold)   @NEW boolean (Is lease hold)
    this.SecondaryEntrance        = data.hasSecondaryEntrance;
    this.Rented                   = data.isRented;                         // boolean (Is rented)
    this.Furnished                = data.isFurnished;                      // boolean (Is furnished) @NEW
    this.BarrierFree              = data.isBarrierFree;                    // boolean (Is barrier free) @NEW


    this.FacilitiesQuality        = data.facilitiesQuality;

    this.Door                     = data.door;                      // string (Door) <= 50 characters  @NEW
    this.Floor                    = data.floor;                     // string (Floor)), null);  @defaultValue

    /*
      Energy Block @defaultValue except EnergyConsumptionValue

    */
    this.WaterHeatingIncluded     = data.waterHeatingIncluded;
    this.EnergyCertificateValue   = parseFloat(data.energyCertificateValue);
    this.EnergyCertificateURL = !isNullOrUndefined(data.energyCertificate) ? data.energyCertificate.certificate : null;
    this.EnergyCertificate        = data.hasEnergyCertificate;      // boolean (Has energy certificate)    @NEW
    this.EnergyConsumptionClass   = data.energyGrade;              // string (Energy grade) Enum:"a" "b" "c" "d" "e" "f" "g" @NEW

    this.EnergyCertificateFileId  = data.EnergyCertificateFileId;
    this.EnergyCertificateStatus  = data.energyCertificateStatus;
    this.EnergyCertificateDate    = data.energyCertificateDate;
    this.EnergyCertificateType    = data.energyCertificateType;
    this.EnergySource             = data.energySource;
    this.EnergyConsumptionValue   = data.EnergyConsumptionValue;

    // string (Roof covering) Enum:"roof_paper" "roof_panels" "metal" "slate" "other"       @NEW
    this.RoofCovering             = data.roofCovering;
    // string (Windows) Enum:"double" "room_high_glazing" "case_window" "simple" "other"    @NEW
    this.Windows                  = data.windows;
    // string (Flooring) Enum:"tiles" "plastic" "parquet" "natural_stone" "carpet_laminate" "other"  @NEW
    this.Flooring                 = data.flooring;

    this.FloorLocation            = data.floorLocation;

    /*
     @defaultValue, string (Heating type), Enum:"underfloor_heating" "single_stoves" "central_heating" "other"
    */
    this.HeatingType              = data.heatingType;

    this.BuildingPropertyId       = data.building;

    this.Apartments               = (data.apartments || []).map((item) =>  new EmbededAppartment(item));
    this.Listings = this.deserializeListings(data.listings);

    this.EstimatedPriceTrend      = data.EstimatedPriceTrend || [];

    this.Title                    = data.title || '';
    this.Description              = data.description || '';

    this.RealtorPercentage = data.realtorPercentage || null;
    this.RealtorPercentageDescription = data.realtorPercentageDescription;

    /*this.Images                   = (data.images || []).map(this.transformImageIdToSrc.bind(null, this.id));*/
    this.Images                   = (data.images || []).map( img => ({id: img.uuid, src: img.image, order: img.order} as IImage));
    this.Images.sort((a, b) => a.order - b.order);

    this.Favourite                = data.isFavorite;        // string (Is favorite);

    this.isOwner                  = data.isOwner;
    this.isRealtor                = data.isRealtor;
    this.hasOwner                 = data.hasOwner;
    this.hasRealtor               = data.hasRealtor;
    this.Ownership                = data.Ownership;
    this.PropertyActivated        = data.PropertyActivated;

    this.ShowAddress              = data.showAddress;
    this.Url                      = data.url;
    this.Source                   = this.getSource(data.url);

    this.Longitude                = data.coordinates ? data.coordinates[0] : null;
    this.Latitude                 = data.coordinates ? data.coordinates[1] : null;

    this.NumberOfDefinedUnits     = data.numberOfDefinedUnits;
    this.NumberOfDisabledUnits    = data.numberOfDisabledUnits;
    this.matchedProperty          = data.matchedProperty;
    this.OperationCost            = data.operationCost;
    this.propertyEditValid        = true;
  }

  serialize(): any {
    const data: any = super.serialize();

    data.realtorPercentage = this.RealtorPercentage;
    data.realtorPercentageDescription = this.RealtorPercentageDescription;
    data.title                = this.Title;
    data.description          = this.Description;
    data.country              = this.Country;
    data.county               = this.County;
    data.city                 = this.Locality;
    data.state                = this.State;
    data.neighbourhood        = this.Neighbourhood;
    data.streetName           = this.Street;
    data.streetNumber         = this.HouseNumber;
    data.zipCode              = this.PostalCode;
    data.estimatedPrice       = this.EstimatedPrice;
    data.estimatedPriceM2     = this.EstimatedPricePerM2;
    data.constructionYear     = this.ConstructionYear;
    data.renovationYear       = this.LastModernisationYear;
    data.furnishingYear       = this.FurnishingYear;
    data.numberOfRooms        = this.RoomsNumber;
    data.numberOfBedrooms     = this.BedroomsNumber;
    data.numberOfBathrooms    = this.BathroomsNumber;
    data.numberOfSeparateWc   = this.SeparateWcNumber;
    data.numberOfBalconies    = this.BalconiesNumber;
    data.numberOfTerraces     = this.TerracesNumber;
    data.numberOfGarages      = this.GaragesNumber;
    data.numberOfParking      = this.ParkingNumber;
    data.numberOfFloors       = this.FloorNumber;
    data.numberOfFlats        = this.FlatsNumber;
    data.numberOfUnits        = this.NumberOfUnits;
    data.livingArea           = this.LivingSurface;
    data.totalArea            = this.TotalArea;
    data.usableArea	          = this.LivingSurfaceMax;
    data.gardenArea           = this.GardenArea;
    data.balconyArea          = this.BalconyArea;
    data.terraceArea	        = this.TerraceArea;
    data.propertyCondition    = this.PropertyCondition;
    data.hasKitchen           = this.Kitchen;
    data.hasElevator          = this.Elevator;
    data.hasGarage            = this.Garage;
    data.hasParking           = this.Parking;
    data.hasTerrace           = this.Terrace;
    data.hasBalcony           = this.Balcony;
    data.hasChimney	          = this.Chimney;
    data.hasAirConditioned	  = this.AirConditioned;
    data.hasSauna             = this.Sauna;
    data.hasSwimmingPool	    = this.SwimmingPool;
    data.hasDryWashSpace	    = this.HasDryWashSpace;
    data.hasBikeRoom	        = this.BikeRoom;
    data.hasVisitorsWc        = this.VisitorsWC;
    data.hasSecondaryEntrance = this.SecondaryEntrance;
    data.hasGarden            = this.Garden;
    data.hasCellar            = this.Cellar;
    data.isHistoricalProperty = this.HistoricalProperty;
    data.isOldProperty        = this.OldProperty;
    data.isLeaseHold          = this.LeaseHold;
    data.isRented             = this.Rented;
    data.isFurnished          = this.Furnished;
    data.isBarrierFree        = this.BarrierFree;
    data.facilitiesQuality    = this.FacilitiesQuality;
    data.door                 = this.Door;
    data.floor                = this.Floor;
    data.hasEnergyCertificate = this.EnergyCertificate;
    data.energyGrade          = this.EnergyConsumptionClass;
    data.waterHeatingIncluded = this.WaterHeatingIncluded;
    data.energyCertificateStatus = this.EnergyCertificateStatus;
    data.energyCertificateDate = this.EnergyCertificateDate;
    data.energyCertificateValue = this.EnergyCertificateValue;
    data.energyCertificateType = this.EnergyCertificateType;
    data.energySource         = this.EnergySource;
    data.roofCovering         = this.RoofCovering;
    data.windows              = this.Windows;
    data.flooring             = this.Flooring;
    data.floorLocation        = this.FloorLocation || '';
    data.heatingType          = this.HeatingType;
    data.isFavorite           = this.Favourite;
    data.apartments           = this.Apartments;
    data.images               = this.Images;
    data.isOwner              = this.isOwner;
    data.isRealtor            = this.isRealtor;
    data.hasOwner             = this.hasOwner;
    data.hasRealtor           = this.hasRealtor;
    data.coordinates          = [this.Longitude, this.Latitude];
    data.showAddress          = this.ShowAddress;
    data.numberOfDefinedUnits = this.NumberOfDefinedUnits;
    data.numberOfDisabledUnits = this.NumberOfDisabledUnits;
    data.matchedProperty      = this.matchedProperty;
    data.operationCost        = this.OperationCost;

    return data;
  }

  serializeListingCreation(): PropertyListingCreationData {
    return {
      salePrice: this.EstimatedPrice,
      sellingStatus: statusToBackEnd(this.SellingStatus)
    };
  }

  serializeShowAddressProperty(): {showAddress: boolean} {
    return {
      showAddress: this.ShowAddress
    };
  }

  private apartmentIsActiveAndHasOwner(apartment: EmbededAppartment): boolean {
    const apartmentIsActive = apartment.SellingStatus === 'Active';
    const apartmentHasOwnerOrRealtor = apartment.hasOwner || apartment.hasRealtor;

    return apartmentIsActive && apartmentHasOwnerOrRealtor;
  }

  private getSource(url: string): string {
    if (url) {
      const source = url.replace('http://', '')
        .replace('https://', '')
        .replace('www.', '')
        .split('.')[0];
      return `${source.charAt(0).toUpperCase()}${source.slice(1)}`;
    } else return '';
  }

  private deserializeListings(listings: any[]): EmbededAppartment[] {
    if (!isNullOrUndefined(listings) && !isEmptyArray(listings)) {
      return listings.map(listing => {
        listing.sellingStatus = 'for_sale';
        return new EmbededAppartment(listing);
      });
    } else {
      return [];
    }
  }
}
