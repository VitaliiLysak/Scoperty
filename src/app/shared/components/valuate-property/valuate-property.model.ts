// Type describing a formatted string, something like "10.250,50" or "250 m2".
export type FormattedString = string;

export interface ValuatePropertyForm {
  livingArea: FormattedString;
  constructionYear: FormattedString;
}

export interface ValuateProperty {
  livingArea?: string;
  constructionYear?: string;
}
