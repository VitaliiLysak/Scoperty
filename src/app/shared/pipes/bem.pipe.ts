import { Pipe, PipeTransform } from '@angular/core';

const dasherize = (str: string): string => {
  return str.replace(/[A-Z](?:(?=[^A-Z])|[A-Z]*(?=[A-Z][^A-Z]|$))/g, (s, i) => (i > 0 ? '-' : '') + s.toLowerCase());
};

interface BEMNotation {
  block: string;
  element?: string;
  mods?: object;
}

// (window as any).bemstat = {};
//
// const stat = (window as any).bemstat;
//
// (window as any).collectBemStat = () =>
//   Object.keys((window as any).bemstat)
//     .map(key => ({
//       name: key,
//       time: (window as any).bemstat[key].time,
//       callCount: (window as any).bemstat[key].callCount,
//       elements: Object.keys((window as any).bemstat[key].elements).map(elemKey => ({
//           name: elemKey,
//           time: (window as any).bemstat[key].elements[elemKey].time,
//           callCount: (window as any).bemstat[key].elements[elemKey].callCount,
//         }))
//         .sort((a, b) => a.time < b.time ? 1 : -1)
//     }))
//     .sort((a, b) => a.time < b.time ? 1 : -1);

@Pipe({
  name: 'bem',
  pure: false
})
export class BEMPipe implements PipeTransform {
  transform({block: blockName, element: elementName, mods = {}}: BEMNotation): string {
    // if (!stat.hasOwnProperty(blockName)) {
    //   stat[blockName] = {
    //     time: 0,
    //     callCount: 0,
    //     elements: {},
    //   };
    // }
    // if (!stat[blockName].elements[elementName]) {
    //   stat[blockName].elements[elementName] = {
    //     time: 0,
    //     callCount: 0,
    //   };
    // }

    // const a = performance.now();
    if (!blockName || blockName === `${void 0}`) throw new Error('Name is required for component.');
    const classNameBasePart = elementName == null ? blockName.trim() : `${blockName.trim()}__${elementName.trim()}`;
    const result =  [classNameBasePart].concat((Object as any).entries(mods).map(([key, value]) => {
      if (value === '' || value == null) return '';
      let mod = '';
      if (value === '@') mod = dasherize(key);
      else mod = `${dasherize(key)}-${value}`;
      return `${classNameBasePart}--${mod}`;
    })).join(' ');
    // const b = performance.now();
    // stat[blockName].elements[elementName].time += (b - a);
    // stat[blockName].elements[elementName].callCount += 1;
    // stat[blockName].time += (b - a);
    // stat[blockName].callCount += 1;
    return result;
  }
}
