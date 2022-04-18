export interface DataLayer {
  [ key: string ]: any;
}

export interface GTMWindow extends Window {
  dataLayer: DataLayer[];
}
