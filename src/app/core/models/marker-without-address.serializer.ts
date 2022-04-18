import {
  GroupedMarkerWithoutAddressData,
  CoordinatesTuple,
  PropertyDetailData,
  PropertyStatus,
  MarkersDto,
  PropertyStatusDto
} from '../../core/models/properties-repository.model';
import { MarkersWithoutAddressData } from '../../core/services/properties-repository.service';
import { propTypeToFrontEnd } from '../../shared/utils/deserializator.util';

import { ExtendedMarkerModel } from './extended-marker.model';
import { MarkerModelWithoutAddress } from './marker-without-address.model';
import { IImage } from './image.model';

export class MarkerWithoutAddressSerializer {
  // preparing marker without address for detaile page
  static createExtendedMarkerFromMarkerWithoutAddress(
    marker: PropertyDetailData,
    property: MarkerModelWithoutAddress | GroupedMarkerWithoutAddressData,
  ): ExtendedMarkerModel {
    const model = new ExtendedMarkerModel();
    model.PropertyId = marker.uuid;
    model.PropertyType = propTypeToFrontEnd(marker.propertyType);
    model.SalePrice = marker.salePrice;
    model.Url = marker.url;
    model.PostalCode = marker.zipCode;
    model.isScraped = marker.isScraped;
    model.Locality = marker.city;
    model.Street = marker.streetName;
    model.Images = marker.images.map((img: any) => ({id: img.uuid, src: img.image} as IImage));
    model.matchedProperty = marker.matchedProperty;
    model.SellingStatus = PropertyStatus.ForSale;
    model.Latitude = property.coordinates[1];
    model.Longitude = property.coordinates[0];

    return model;
  }

  // grouping marker with same coordinates
  static groupedMarker(markerWithoutAddress: MarkersWithoutAddressData.Marker[]): GroupedMarkerWithoutAddressData[] {
    const groups = {};
     for (let i = 0; i < markerWithoutAddress.length; i++) {
       const groupNameCoordinates: string = markerWithoutAddress[i].coordinates.join(',');
       if (!groups.hasOwnProperty(groupNameCoordinates)) {
         groups[groupNameCoordinates] = [];
       }
       delete markerWithoutAddress[i].coordinates;
       groups[groupNameCoordinates].push(markerWithoutAddress[i]);
     }

     const groupedMarkerWithoutAddress: GroupedMarkerWithoutAddressData[] = [];
     for (const groupNameCoordinates in groups) {
       if (groups.hasOwnProperty(groupNameCoordinates)) {
         const [x, y] = groupNameCoordinates.split(',').map((coordinate) => Number(coordinate));
         const coordinates: CoordinatesTuple = [x, y];
         groupedMarkerWithoutAddress.push({
           coordinates: coordinates,
           propertyDetailData: groups[groupNameCoordinates]
         });
       }
     }

     return groupedMarkerWithoutAddress;
  }

  static createFragmentsFromMarkerWithoutAddress(marker: GroupedMarkerWithoutAddressData): MarkersDto {
    const fragments: MarkersDto = {
      type: 'Feature',
      properties : {
        sellingStatus: PropertyStatusDto.ForSale,
        propertyType: marker.propertyDetailData[0].propertyType,
        coordinates: {
          type: 'Point',
          coordinates: marker.coordinates
        },
        matchedProperty: marker.propertyDetailData[0].matchedProperty,
        uuid: marker.propertyDetailData[0].uuid,
        url: marker.propertyDetailData[0].url,
        isScrapedWithoutAddress: true,
        scrapedWithoutAddressGroupedQuantity: marker.propertyDetailData.length > 1 ? marker.propertyDetailData.length : null
      },
      geometry: {
        type: 'Point',
        coordinates: marker.coordinates
      },
      coordinates: marker.coordinates,
      markerWithoutAddress: marker
    };

    return fragments;
  }
}
