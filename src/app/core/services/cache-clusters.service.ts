import { Injectable } from '@angular/core';

@Injectable()
export class CacheClustersService {

  private _storage: Storage = localStorage;

  constructor() {}

  public create(clusters: Array<any> = []): void {
    if (this._storage.getItem('clusters_cache')) this.clearCache();

    this._storage.setItem('clusters_cache', JSON.stringify(clusters));
  }

  public filter(newClusters: Array<any>): Array<any> {
    if (!this._storage.getItem('clusters_cache')) return [];

    const oldClusters: Array<any> = JSON.parse(this._storage.getItem('clusters_cache'));
    const clustersForRender: Array<any> = [];

    goto:
    for (let i = 0; i < oldClusters.length; i++) {
      const cluster = oldClusters[i];
      for (let k = 0; k < newClusters.length; k++) {
        if (cluster.Name === newClusters[k].Name && cluster.Count === newClusters[k].Count) break goto;
      }
      clustersForRender.push(cluster);
    }

    this.update(clustersForRender);
    return clustersForRender;
  }

  public get(): Array<any> {
    if (!this._storage.getItem('clusters_cache')) return [];
    return JSON.parse(this._storage.getItem('clusters_cache'));
  }

  public update(clusters: Array<any>): boolean {
    if (!this._storage.getItem('clusters_cache')) this.create();

    const oldClusters: Array<any> = JSON.parse(this._storage.getItem('clusters_cache'));
    const updatedClusters = [...oldClusters, ...clusters];

    this.create(updatedClusters);
    return true;
  }

  public delete(name: string): boolean {
    if (!this._storage.getItem('clusters_cache')) return false;

    const oldClusters: Array<any> = JSON.parse(this._storage.getItem('clusters_cache'));
    const updatedClusters: Array<any> = oldClusters.filter(cluster => cluster.name !== name);

    this.create(updatedClusters);
    return true;
  }

  public clearCache(): boolean {
    if (!this._storage.getItem('clusters_cache')) return false;
    this._storage.removeItem('clusters_cache');
    return true;
  }
}
