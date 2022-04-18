import { isEmptyString } from '../../../shared/utils/empty-string.util';
import { isNullOrUndefined } from '../../../shared/utils/null-or-undefined.util';

import {
  ProcessType,
  AddFavoriteSignupInfo,
  CreateSearchAlertsSignupInfo,
  CreateOfferSignupInfo,
  ContactOwnerSignupInfo,
  ContactOwnerSignupInfoPayloadDto,
  AddFavoriteSignupInfoPayloadDto,
  CreateSearchAlertsSignupInfoPayloadDto,
  CreateOfferSignupInfoPayloadDto,
  ClaimPropertySignupInfoPayloadDto,
  ClaimPropertySignupInfo,
  SignupInfo,
  SignupInfoDto,
  ClaimApartmentSignupInfoPayloadDto,
  ClaimApartmentSignupInfo,
  OpenMarketAttractivitySignupInfo,
  OpenMarketAttractivityPayloadDto,
} from './signup-info.model';

export class SignupInfoSerializer {
  static deserialize(cognitoDto: string): SignupInfo {
    if (isEmptyString(cognitoDto)) {
      return null;
    }

    const dto: SignupInfoDto = JSON.parse(cognitoDto);
    let model: SignupInfo = null;
    const {processType} = dto;
    switch (processType) {
      case ProcessType.AddFavorite: {
        const { propertyId } = dto.payload as AddFavoriteSignupInfoPayloadDto;
        model = new AddFavoriteSignupInfo(propertyId);
        break;
      }
      case ProcessType.CreateSearchAlerts: {
        const {
          name,
          coordinates,
          radius,
          address_line,
          city,
          priceMin,
          priceMax,
          livingAreaMin,
          livingAreaMax,
          propertyTypes,
          sellingStatuses
        } = dto.payload as CreateSearchAlertsSignupInfoPayloadDto;
        model = new CreateSearchAlertsSignupInfo(
          name,
          coordinates,
          radius,
          address_line,
          city,
          priceMin,
          priceMax,
          livingAreaMin,
          livingAreaMax,
          propertyTypes,
          sellingStatuses
        );
        break;
      }
      case ProcessType.CreateOffer: {
        const {
          property,
          price,
          preferredTotalArea
        } = dto.payload as CreateOfferSignupInfoPayloadDto;
        model = new CreateOfferSignupInfo(
          property,
          price,
          preferredTotalArea
        );
        break;
      }
      case ProcessType.ClaimProperty: {
        const { propertyId, livingArea, constructionYear } = dto.payload as ClaimPropertySignupInfoPayloadDto;
        model = new ClaimPropertySignupInfo(propertyId, livingArea, constructionYear);
        break;
      }
      case ProcessType.ClaimApartment: {
        const {
          propertyId,
          floor,
          floorLocation,
        } = dto.payload as ClaimApartmentSignupInfoPayloadDto;
        model = new ClaimApartmentSignupInfo(
          propertyId,
          floor,
          floorLocation
        );
        break;
      }
      case ProcessType.ContactOwner: {
        const { propertyId } = dto.payload as ContactOwnerSignupInfoPayloadDto;
        model = new ContactOwnerSignupInfo(propertyId);
        break;
      }
      case ProcessType.OpenMarketAttractivity: {
        const { propertyId } = dto.payload as OpenMarketAttractivityPayloadDto;
        model = new OpenMarketAttractivitySignupInfo(propertyId);
        break;
      }
    }

    return model;
  }

  static serialize(model: SignupInfo): string {
    if (isNullOrUndefined(model)) {
      return null;
    }

    let dto: SignupInfoDto = null;
    if (model instanceof AddFavoriteSignupInfo) {
      dto = {
        processType: ProcessType.AddFavorite,
        payload: model,
      };
    } else if (model instanceof CreateSearchAlertsSignupInfo) {
      dto = {
        processType: ProcessType.CreateSearchAlerts,
        payload: model,
      };
    } else if (model instanceof CreateOfferSignupInfo) {
      dto = {
        processType: ProcessType.CreateOffer,
        payload: model,
      };
    } else if (model instanceof ClaimPropertySignupInfo) {
      dto = {
        processType: ProcessType.ClaimProperty,
        payload: model,
      };
    } else if (model instanceof ClaimApartmentSignupInfo) {
      dto = {
        processType: ProcessType.ClaimApartment,
        payload: model,
      };
    } else if (model instanceof ContactOwnerSignupInfo) {
      dto = {
        processType: ProcessType.ContactOwner,
        payload: model,
      };
    } else if (model instanceof OpenMarketAttractivitySignupInfo) {
      dto = {
        processType: ProcessType.OpenMarketAttractivity,
        payload: model,
      };
    }

    return JSON.stringify(dto);
  }
}
