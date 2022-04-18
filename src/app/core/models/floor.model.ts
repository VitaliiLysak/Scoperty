import {
  GROUND_FLOOR,
  MAX_FLOORS_COUNT,
} from '../../app.constants';

export interface Floor {
  id: number;
  text: string;
}

export function createFloors(): Array<Floor> {
  let floors: Array<Floor> = Array.from({ length: MAX_FLOORS_COUNT }, (value, key) => {
    return { id: key + 1, text: (key + 1).toString() };
  });
  floors.unshift({ id: 0, text: GROUND_FLOOR });
  floors = floors.map(({id, text}) => {
    return { id: id + 1, text };
  });

  return floors;
}
