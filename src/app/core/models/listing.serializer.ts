import {
  PropertiesListFeatures,
  InitialPropertyObject,
  ListingDetailsDto,
} from '../../core/models/properties-repository.model';
import { ListingModel } from '../../core/models/listing.model';
import {
  propTypeToFrontEnd,
  statusToFrontEndOriginal,
} from '../../shared/utils/deserializator.util';
import { isEmptyString } from '../../shared/utils/empty-string.util';

import { ExtendedMarkerModel } from './extended-marker.model';
import { ImageSerializer } from './image.serializer';
import { MarkerModel } from './marker.model';
import { FragmentModel } from './fragment.model';
import { MarkerModelWithoutAddress } from './marker-without-address.model';

export class ListingSerializer {
  static createListing(marker: PropertiesListFeatures): ListingModel {
    return new ListingModel(
      marker.properties.uuid,
      marker.properties.images,
      marker.properties.title,
      marker.properties.description,
      marker.properties.url,
      marker.properties.providerId,
      marker.properties.matchedProperty,
      marker.properties.country,
      marker.properties.state,
      marker.properties.county,
      marker.properties.city,
      marker.properties.zipCode,
      marker.properties.streetName,
      marker.properties.streetNumber,
      new Date(marker.properties.constructionYear),
      new Date(marker.properties.renovationYear),
      marker.properties.numberOfRooms,
      marker.properties.numberOfUnits,
      marker.properties.livingArea,
      marker.properties.estimatedPrice,
      marker.properties.estimatedPriceM2,
      marker.properties.salePrice,
      marker.properties.showAddress,
      marker.geometry ? marker.geometry.coordinates : null,
      statusToFrontEndOriginal(marker.properties.sellingStatus),
      propTypeToFrontEnd(marker.properties.propertyType),
    );
  }

  static createListingFromProperty(marker: InitialPropertyObject): ListingModel {
    return new ListingModel(
      marker.uuid,
      marker.images,
      marker.title,
      marker.description,
      marker.url,
      null,
      undefined,
      marker.country,
      marker.state,
      marker.county,
      marker.city,
      marker.zipCode.toString(),
      marker.streetName,
      marker.streetNumber.toString(),
      new Date(marker.constructionYear),
      new Date(marker.renovationYear),
      marker.numberOfRooms,
      marker.numberOfUnits,
      marker.livingArea,
      marker.estimatedPrice,
      marker.estimatedPriceM2,
      marker.salePrice,
      marker.showAddress,
      marker.coordinates ? marker.coordinates.coordinates : null,
      statusToFrontEndOriginal(marker.sellingStatus),
      propTypeToFrontEnd(marker.propertyType),
    );
  }

  static createMarkerFromListing(listing: ListingModel): ExtendedMarkerModel {
    const marker = new ExtendedMarkerModel(listing);
    marker.PropertyType = listing.propertyType;
    marker.SellingStatus = listing.sellingStatus;

    return marker;
  }

  static createMarkerFromListingDetails(
    marker: ExtendedMarkerModel,
    property: ExtendedMarkerModel | MarkerModel | FragmentModel | MarkerModelWithoutAddress,
    listingDetails: ListingDetailsDto,
  ): ExtendedMarkerModel {
    const model = new ExtendedMarkerModel(marker);
    model.PropertyId = listingDetails.uuid;
    model.Locality = listingDetails.city;
    model.Country = listingDetails.country;
    model.County = listingDetails.county;
    model.Images = ImageSerializer.createImages(listingDetails.images);
    model.matchedProperty = listingDetails.matchedProperty;
    model.PropertyType = propTypeToFrontEnd(listingDetails.propertyType);
    model.SalePrice = listingDetails.salePrice;
    model.EstimatedPrice = listingDetails.estimatedPrice;
    model.ShowAddress = listingDetails.showAddress;
    model.State = listingDetails.state;
    model.Street = listingDetails.streetName;
    model.HouseNumber = listingDetails.streetNumber;
    model.Url = listingDetails.url;
    model.PostalCode = listingDetails.zipCode;
    model.isScraped = listingDetails.hasOwnProperty('url') && !isEmptyString(listingDetails.url);
    model.Latitude = (property as ExtendedMarkerModel | MarkerModel | FragmentModel).Latitude;
    model.Longitude = (property as ExtendedMarkerModel | MarkerModel | FragmentModel).Longitude;
    model.SellingStatus = (property as ExtendedMarkerModel | MarkerModel | FragmentModel).SellingStatus;

    return model;
  }
}
