import { isNullOrUndefined } from '../../shared/utils/null-or-undefined.util';

import { IImage, ImageDto, } from './image.model';

export class ImageSerializer {
  static createImages(dtos: ImageDto[]): IImage[] {
    if (isNullOrUndefined(dtos)) {
      return [];
    }

    return dtos.map((dto: ImageDto) => ImageSerializer.createImage(dto));
  }

  static createImage(dto: ImageDto): IImage {
    return {
      id: dto.uuid,
      src: dto.image,
      order: dto.order
    };
  }
}
