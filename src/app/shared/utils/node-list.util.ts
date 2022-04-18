import { isNullOrUndefined } from './null-or-undefined.util';

export function getLastElementFromNodeList<T extends Node>(nodeList: NodeListOf<T>): T {
  const isEmptyNodeList = isNullOrUndefined(nodeList) || nodeList.length < 1;
  if (isEmptyNodeList) {
    return null;
  }

  const lastNodeListElement: T = nodeList[nodeList.length - 1];
  return lastNodeListElement;
}
