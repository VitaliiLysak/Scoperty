interface StaticDataFeBe {
  id: number;
  text: string;
  shortText?: string;
  textBe: string;
}

export function transformFeBe(array: StaticDataFeBe[], text: string): any {
  return array.find(item => item.text === text).textBe;
}
