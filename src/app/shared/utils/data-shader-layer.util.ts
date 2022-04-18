import { MAP_DATA_SHADER_LAYER_CONFIG } from '../../main/main.constants';

export function shouldShowDataShaderLayer(zoom: number): boolean {
  const { minZoom, maxZoom } = MAP_DATA_SHADER_LAYER_CONFIG;
  return zoom >= minZoom && zoom <= maxZoom;
}
